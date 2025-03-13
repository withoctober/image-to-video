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
	redirect,
}: {
	provider: keyof typeof oAuthProviders;
	className?: string;
	redirect?: string;
}) {
	const [invitationId] = useQueryState("invitationId", parseAsString);
	const providerData = oAuthProviders[provider];

	// 获取url的参数

	const redirectPath = redirect || config.auth.redirectAfterSignIn || "/";

	const onSignin = () => {
		const callbackURL = new URL(redirectPath, window.location.origin);
		authClient.signIn.social({
			provider,
			callbackURL: callbackURL.toString(),
		});
	};

	return (
		<Button
			onClick={() => onSignin()}
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
