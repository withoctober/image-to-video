"use client";

import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { Button } from "@ui/components/button";
import { useQueryState } from "nuqs";
import { parseAsString } from "nuqs";
import { oAuthProviders } from "../constants/oauth-providers";

export function SocialSigninButton({
	provider,
	className,
}: {
	provider: keyof typeof oAuthProviders;
	className?: string;
}) {
	const [invitationId] = useQueryState("invitationId", parseAsString);
	const providerData = oAuthProviders[provider];

	const redirectPath = invitationId
		? `/app/organization-invitation/${invitationId}`
		: config.auth.redirectAfterSignIn;
	const callbackURL = new URL(redirectPath, window.location.origin);

	return (
		<Button
			onClick={() => {
				authClient.signIn.social({
					provider,
					callbackURL: callbackURL.toString(),
				});
			}}
			variant="outline"
			type="button"
			className={className}
		>
			{providerData.icon && (
				<i className="mr-2 text-primary">
					<providerData.icon className="size-4" />
				</i>
			)}
			{providerData.name}
		</Button>
	);
}
