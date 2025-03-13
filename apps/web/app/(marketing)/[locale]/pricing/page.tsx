import { PricingTable } from "@saas/payments/components/PricingTable";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("pricing");
	return {
		title: t("title"),
		description: t("subtitle"),
		alternates: {
			canonical: "./",
		},
	};
}

export default function PricingPage() {
	const t = useTranslations("pricing");

	return (
		<div className="relative max-w-full overflow-x-hidden bg-linear-to-b from-0% from-card to-[50vh] to-background">
			<div className="absolute left-1/2 z-10 ml-[-500px] h-[500px] w-[1000px] rounded-full bg-linear-to-r from-primary to-bg opacity-20 blur-[150px]" />
			<div className="container relative z-20 pt-44 pb-12 text-center lg:pb-16">
				<h1 className="mx-auto max-w-3xl text-balance font-bold text-5xl lg:text-7xl">
					{t("title")}
				</h1>

				<p className="mx-auto mt-4 max-w-lg text-balance text-foreground/60 text-lg">
					{t("subtitle")}
				</p>

				<div className="mx-auto mt-16">
					<PricingTable />
				</div>
			</div>
		</div>
	);
}
