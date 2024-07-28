import { Heading, Link, Text } from "@react-email/components";
import type { BaseMailProps } from "../types";
import PrimaryButton from "./components/PrimaryButton";
import Wrapper from "./components/Wrapper";

export function TeamInvitation({
	url,
	teamName,
	locale,
	translations,
}: {
	url: string;
	teamName: string;
} & BaseMailProps): JSX.Element {
	return (
		<Wrapper>
			<Heading className="text-xl">
				Join the team <strong>{teamName}</strong>
			</Heading>
			<Text>
				You have been invited to join the team {teamName}. Click the button
				below or copy and paste the link into your browser of choice to accept
				the invitation and join the team.
			</Text>

			<PrimaryButton href={url}>Join the team</PrimaryButton>

			<Text className="mt-4 text-muted-foreground text-sm">
				Or manually copy and paste this link into your browser:
				<Link href={url}>{url}</Link>
			</Text>
		</Wrapper>
	);
}

export default TeamInvitation;
