import {} from "@ui/components/accordion";
import { cn } from "@ui/lib";
import { useTranslations } from "next-intl";

export function FaqSection({ className }: { className?: string }) {
	const t = useTranslations();

	const items = [
		{
			question: "What is the refund policy?",
			answer:
				"We offer a 30-day money-back guarantee if you're not happy with our product.",
		},
		{
			question: "How do I cancel my subscription?",
			answer: "You can cancel your subscription by visiting the billing page.",
		},
		{
			question: "Can I change my plan?",
			answer:
				"Yes, you can change your plan at any time by visiting the billing page.",
		},
		{
			question: "Do you offer a free trial?",
			answer: "Yes, we offer a 14-day free trial.",
		},
	];

	if (!items) {
		return null;
	}

	return (
		<section
			className={cn("scroll-mt-20 border-t py-12 lg:py-16", className)}
			id="faq"
		>
			<div className="container max-w-5xl">
				<div className="mb-12 lg:text-center">
					<h1 className="mb-2 font-bold text-4xl lg:text-5xl">
						{t("faq.title")}
					</h1>
					<p className="text-lg opacity-50">{t("faq.description")}</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2">
					{items.map((item, i) => (
						<div
							key={`faq-item-${i}`}
							className="border-border/50 border-t py-6 first:border-t-0 first:pt-0 last:pb-0 md:p-8 md:even:border-l md:last:pb-8 md:first:pt-8 md:[&:nth-child(2)]:border-t-0"
						>
							<h4 className="py-2 font-semibold text-lg">{item.question}</h4>
							<p className="text-foreground/60">{item.answer}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
