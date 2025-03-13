import { FaqSection } from "@marketing/home/components/FaqSection";
import { Usecases } from "@marketing/home/components/Usecases";
import Generator from "@marketing/home/components/Generator";
import { Hero } from "@marketing/home/components/Hero";
import { HowItWorks } from "@marketing/home/components/HowItWorks";
import { Newsletter } from "@marketing/home/components/Newsletter";
import { PricingSection } from "@marketing/home/components/PricingSection";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CallToAction } from "@marketing/home/components/CallToAction";

export async function generateMetadata({
	params,
}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;

	const t = await getTranslations({
		locale,
		namespace: "main",
	});

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		title: {
			absolute: t("title"),
		},
		description: t("description"),
		alternates: {
			canonical: "./",
		},
	};
}

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<>
			<Hero />
			<Generator />
			<HowItWorks />
			<Usecases />
			<FaqSection />
			<CallToAction />
		</>
	);
}
