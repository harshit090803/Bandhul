import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return NextResponse.json(
        { error: "You must be signed in to activate your account." },
        { status: 401 }
      );
    }

    const email = user.email.toLowerCase();

    // Find the pending invitation belonging to this email.
    const { data: invitation, error: invitationError } =
      await admin
        .from("family_invitations")
        .select("id, person_id, invited_email, status, expires_at")
        .eq("invited_email", email)
        .eq("status", "PENDING")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (invitationError) {
      console.error(
        "Invitation lookup failed:",
        invitationError
      );

      return NextResponse.json(
        { error: "Could not find your family invitation." },
        { status: 500 }
      );
    }

    if (!invitation) {
      return NextResponse.json(
        {
          error:
            "No pending Bandhul invitation was found for this email address.",
        },
        { status: 404 }
      );
    }

    if (new Date(invitation.expires_at).getTime() < Date.now()) {
      await admin
        .from("family_invitations")
        .update({ status: "EXPIRED" })
        .eq("id", invitation.id);

      return NextResponse.json(
        {
          error:
            "This Bandhul invitation has expired. Please ask a family member to send a new invitation.",
        },
        { status: 410 }
      );
    }

    // Prevent duplicate account links.
    const { data: existingPersonAccount } = await admin
      .from("person_accounts")
      .select("id")
      .eq("person_id", invitation.person_id)
      .maybeSingle();

    if (existingPersonAccount) {
      return NextResponse.json(
        {
          error:
            "This family member is already linked to a Bandhul account.",
        },
        { status: 409 }
      );
    }

    const { data: existingUserAccount } = await admin
      .from("person_accounts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingUserAccount) {
      return NextResponse.json(
        {
          error:
            "Your Bandhul account is already linked to a family member.",
        },
        { status: 409 }
      );
    }

    // Link the Auth user to the existing Person.
    const { error: linkError } = await admin
      .from("person_accounts")
      .insert({
        person_id: invitation.person_id,
        user_id: user.id,
      });

    if (linkError) {
      console.error("Person account linking failed:", linkError);

      return NextResponse.json(
        { error: "Could not link your family account." },
        { status: 500 }
      );
    }

    // Mark invitation as accepted.
    const { error: updateInvitationError } = await admin
      .from("family_invitations")
      .update({
        status: "ACCEPTED",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invitation.id);

    if (updateInvitationError) {
      console.error(
        "Invitation status update failed:",
        updateInvitationError
      );

      // The account is already safely linked, so don't undo it.
      return NextResponse.json({
        success: true,
        warning:
          "Your account was linked, but the invitation status could not be updated.",
      });
    }

    // Record the account link in contribution history.
    const { error: contributionError } = await admin
      .from("contributions")
      .insert({
        user_id: user.id,
        action: "LINK",
        entity_type: "ACCOUNT",
        entity_id: invitation.person_id,
        description:
          "Activated a Bandhul account through a family invitation.",
      });

    if (contributionError) {
      console.error(
        "Contribution recording failed:",
        contributionError
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Invitation acceptance error:", error);

    return NextResponse.json(
      { error: "Something went wrong while activating your account." },
      { status: 500 }
    );
  }
}