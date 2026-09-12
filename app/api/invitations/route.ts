import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // ---------------------------------------------------------
    // 1. Verify currently logged-in Bandhul user
    // ---------------------------------------------------------
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error: "You must be logged in to send an invitation.",
        },
        { status: 401 }
      );
    }

    // ---------------------------------------------------------
    // 2. Read request body
    // ---------------------------------------------------------
    let body: {
      personId?: unknown;
      email?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const personId = String(body.personId ?? "").trim();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    // ---------------------------------------------------------
    // 3. Validate required fields
    // ---------------------------------------------------------
    if (!personId || !email) {
      return NextResponse.json(
        {
          error: "Person ID and email are required.",
        },
        { status: 400 }
      );
    }

    // Basic email validation.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          error: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 4. Verify the Person
    //
    // IMPORTANT:
    // Use the normal authenticated client here.
    // The logged-in user already has permission to read people.
    // ---------------------------------------------------------
    const { data: person, error: personError } = await supabase
      .from("people")
      .select(
        "id, first_name, middle_name, last_name, life_status, is_deleted"
      )
      .eq("id", personId)
      .maybeSingle();

    if (personError) {
      console.error("Person lookup failed:", {
        message: personError.message,
        details: personError.details,
        hint: personError.hint,
        code: personError.code,
      });

      return NextResponse.json(
        {
          error: "Could not verify the family member.",
        },
        { status: 500 }
      );
    }

    if (!person) {
      return NextResponse.json(
        {
          error: "That family member could not be found.",
        },
        { status: 404 }
      );
    }

    if (person.is_deleted) {
      return NextResponse.json(
        {
          error: "That family member has been removed from the archive.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------------------
    // 5. Invitations are only for living people
    // ---------------------------------------------------------
    if (person.life_status !== "ALIVE") {
      return NextResponse.json(
        {
          error:
            "Invitations can only be sent to living family members.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 6. Check whether this Person already has an account
    // ---------------------------------------------------------
    const { data: existingAccount, error: accountError } =
      await supabase
        .from("person_accounts")
        .select("id, user_id")
        .eq("person_id", personId)
        .maybeSingle();

    if (accountError) {
      console.error("Account lookup failed:", {
        message: accountError.message,
        details: accountError.details,
        hint: accountError.hint,
        code: accountError.code,
      });

      return NextResponse.json(
        {
          error:
            "Could not verify the person's account status.",
        },
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

    // ---------------------------------------------------------
    // 7. Check for an existing pending invitation
    // ---------------------------------------------------------
    const {
      data: existingInvitation,
      error: invitationLookupError,
    } = await supabase
      .from("family_invitations")
      .select("id, status, expires_at")
      .eq("person_id", personId)
      .eq("status", "PENDING")
      .maybeSingle();

    if (invitationLookupError) {
      console.error("Invitation lookup failed:", {
        message: invitationLookupError.message,
        details: invitationLookupError.details,
        hint: invitationLookupError.hint,
        code: invitationLookupError.code,
      });

      return NextResponse.json(
        {
          error: "Could not check existing invitations.",
        },
        { status: 500 }
      );
    }

    if (existingInvitation) {
      const expiresAt = new Date(
        existingInvitation.expires_at
      ).getTime();

      const expired = expiresAt <= Date.now();

      if (!expired) {
        return NextResponse.json(
          {
            error:
              "A pending invitation already exists for this family member.",
          },
          { status: 409 }
        );
      }

      // Mark old invitation as expired.
      const { error: expireError } = await supabase
        .from("family_invitations")
        .update({
          status: "EXPIRED",
        })
        .eq("id", existingInvitation.id);

      if (expireError) {
        console.error(
          "Failed to expire old invitation:",
          expireError
        );

        return NextResponse.json(
          {
            error:
              "Could not prepare a new invitation for this family member.",
          },
          { status: 500 }
        );
      }
    }

    // ---------------------------------------------------------
    // 8. Create Bandhul invitation record
    // ---------------------------------------------------------
    const {
      data: invitation,
      error: createInvitationError,
    } = await supabase
      .from("family_invitations")
      .insert({
        person_id: personId,
        invited_email: email,
        invited_by: user.id,
        status: "PENDING",
      })
      .select()
      .single();

    if (createInvitationError || !invitation) {
      console.error(
        "Invitation record creation failed:",
        createInvitationError
      );

      return NextResponse.json(
        {
          error:
            createInvitationError?.message ??
            "Could not create the invitation record.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 9. Create Supabase Auth invitation
    //
    // Admin client is intentionally used ONLY here because
    // inviteUserByEmail requires an admin/secret key.
    // ---------------------------------------------------------
    const admin = createAdminClient();

    const origin = new URL(request.url).origin;

    const fullName = [
      person.first_name,
      person.middle_name,
      person.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    const {
      data: invitedUser,
      error: inviteError,
    } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${origin}/invite`,
      data: {
        invited_person_id: personId,
        invitation_id: invitation.id,
        person_name: fullName,
      },
    });

    // ---------------------------------------------------------
    // 10. If Supabase Auth invitation failed
    // ---------------------------------------------------------
    if (inviteError) {
      console.error("Supabase Auth invite failed:", {
        message: inviteError.message,
        name: inviteError.name,
        status: inviteError.status,
      });

      // Do not leave a fake pending invitation.
      const { error: cancelError } = await supabase
        .from("family_invitations")
        .update({
          status: "CANCELLED",
        })
        .eq("id", invitation.id);

      if (cancelError) {
        console.error(
          "Failed to cancel invitation after Auth failure:",
          cancelError
        );
      }

      return NextResponse.json(
        {
          error: inviteError.message,
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 11. Success
    // ---------------------------------------------------------
    return NextResponse.json({
      success: true,
      invitationId: invitation.id,
      userId: invitedUser.user?.id ?? null,
      message: `Invitation sent to ${email}.`,
    });
  } catch (error) {
    console.error("Invitation API error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while sending the invitation.",
      },
      { status: 500 }
    );
  }
}