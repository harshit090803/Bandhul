import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    // Verify the currently logged-in Bandhul user.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to send an invitation." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const personId = String(body.personId ?? "").trim();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    if (!personId || !email) {
      return NextResponse.json(
        { error: "Person ID and email are required." },
        { status: 400 }
      );
    }

    // Basic email validation.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Make sure the Person exists and is alive.
    const { data: person, error: personError } = await admin
      .from("people")
      .select("id, first_name, middle_name, last_name, life_status, is_deleted")
      .eq("id", personId)
      .maybeSingle();

    if (personError) {
      console.error("Person lookup failed:", personError);

      return NextResponse.json(
        { error: "Could not verify the family member." },
        { status: 500 }
      );
    }

    if (!person || person.is_deleted) {
      return NextResponse.json(
        { error: "That family member does not exist." },
        { status: 404 }
      );
    }

    if (person.life_status !== "ALIVE") {
      return NextResponse.json(
        {
          error:
            "Invitations can only be sent to living family members.",
        },
        { status: 400 }
      );
    }

    // Make sure this Person isn't already linked to an account.
    const { data: existingAccount, error: accountError } = await admin
      .from("person_accounts")
      .select("id")
      .eq("person_id", personId)
      .maybeSingle();

    if (accountError) {
      console.error("Account lookup failed:", accountError);

      return NextResponse.json(
        { error: "Could not verify the person's account status." },
        { status: 500 }
      );
    }

    if (existingAccount) {
      return NextResponse.json(
        {
          error:
            "This family member already has a Bandhul account.",
        },
        { status: 409 }
      );
    }

    // Check for an existing pending invitation.
    const { data: existingInvitation, error: invitationLookupError } =
      await admin
        .from("family_invitations")
        .select("id, status, expires_at")
        .eq("person_id", personId)
        .eq("status", "PENDING")
        .maybeSingle();

    if (invitationLookupError) {
      console.error(
        "Invitation lookup failed:",
        invitationLookupError
      );

      return NextResponse.json(
        { error: "Could not check existing invitations." },
        { status: 500 }
      );
    }

    if (existingInvitation) {
      const expired =
        new Date(existingInvitation.expires_at).getTime() <
        Date.now();

      if (!expired) {
        return NextResponse.json(
          {
            error:
              "A pending invitation already exists for this family member.",
          },
          { status: 409 }
        );
      }

      // The database invitation expired. Mark it as expired so
      // a fresh invitation can be created.
      await admin
        .from("family_invitations")
        .update({ status: "EXPIRED" })
        .eq("id", existingInvitation.id);
    }

    // Create our Bandhul invitation record first.
    const { data: invitation, error: createInvitationError } =
      await admin
        .from("family_invitations")
        .insert({
          person_id: personId,
          invited_email: email,
          invited_by: user.id,
          status: "PENDING",
        })
        .select()
        .single();

    if (createInvitationError) {
      console.error(
        "Invitation record creation failed:",
        createInvitationError
      );

      return NextResponse.json(
        { error: createInvitationError.message },
        { status: 500 }
      );
    }

    const origin = new URL(request.url).origin;

    const fullName = [
      person.first_name,
      person.middle_name,
      person.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    // Ask Supabase Auth to create the invited Auth user
    // and send the invitation email.
    const { data: invitedUser, error: inviteError } =
      await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${origin}/invite`,
        data: {
          invited_person_id: personId,
          invitation_id: invitation.id,
          person_name: fullName,
        },
      });

    if (inviteError) {
      console.error("Supabase invite failed:", inviteError);

      // Do not leave a fake PENDING invitation behind.
      await admin
        .from("family_invitations")
        .update({ status: "CANCELLED" })
        .eq("id", invitation.id);

      return NextResponse.json(
        {
          error: inviteError.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      invitationId: invitation.id,
      userId: invitedUser.user?.id ?? null,
      message: `Invitation sent to ${email}.`,
    });
  } catch (error) {
    console.error("Invitation API error:", error);

    return NextResponse.json(
      { error: "Something went wrong while sending the invitation." },
      { status: 500 }
    );
  }
}