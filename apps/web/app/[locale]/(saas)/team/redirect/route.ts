import { TEAM_SLUG_COOKIE_NAME } from "@saas/shared/types";
import { createApiCaller } from "api";
import { Team } from "database";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const apiCaller = await createApiCaller();

  const redirectTo = requestUrl.searchParams.get("redirectTo") || null;

  const getRedirectUrl = ({
    teamSlug,
    path,
  }: {
    teamSlug?: string;
    path: string;
  }) => {
    let redirectPath = redirectTo ?? path;
    if (teamSlug && redirectPath.includes("[teamSlug]"))
      redirectPath = redirectPath.replace("[teamSlug]", teamSlug);

    return new URL(redirectPath, requestUrl.origin).toString();
  };

  try {
    const user = await apiCaller.auth.user();

    if (!user) {
      const redirectUrl = new URL("/auth/login", requestUrl.origin);
      if (redirectTo) redirectUrl.searchParams.set("redirectTo", redirectTo);
      return NextResponse.redirect(redirectUrl);
    }

    const { teamMemberships } = user;

    // if user has no teams, we create one for them
    if (!teamMemberships || !teamMemberships.length) {
      let team: Team | undefined = undefined;

      try {
        const name = user.name || user.email.split("@")[0];
        team = await apiCaller.team.create({
          name,
        });
      } catch (e) {
        console.error(e);
        return NextResponse.redirect("/");
      }

      return NextResponse.redirect(
        getRedirectUrl({
          teamSlug: team.slug,
          path: "/[teamSlug]/dashboard",
        }),
      );
    }

    // check cookie for latest team
    const teamSlugCookie = cookies().get(TEAM_SLUG_COOKIE_NAME)?.value;

    if (teamSlugCookie) {
      const teamMembership = teamMemberships.find(
        (membership) => membership.team.slug === teamSlugCookie,
      );

      if (teamMembership) {
        return NextResponse.redirect(
          getRedirectUrl({
            teamSlug: teamMembership.team.slug,
            path: "/[teamSlug]/dashboard",
          }),
        );
      }
    }

    return NextResponse.redirect(
      getRedirectUrl({
        teamSlug: teamMemberships[0].team.slug,
        path: "/[teamSlug]/dashboard",
      }),
    );
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(requestUrl.origin);
  }
}
