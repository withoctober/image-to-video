import { Container, Heading, Section, Text } from "@react-email/components";
import type { BaseMailProps } from "../types";
import Wrapper from "./components/Wrapper";

export function NewsletterSignup({
	locale,
	translations,
}: BaseMailProps): JSX.Element {
	return (
		<Wrapper>
			<Section className="bg-card p-8">
				<Container>
					<Heading as="h1">Welcome to our newsletter!</Heading>
					<Text>Thank you for signing up for the supastarter newsletter.</Text>
				</Container>
			</Section>
		</Wrapper>
	);
}

export default NewsletterSignup;
