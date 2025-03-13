import { cn } from "@ui/lib";
import { useTranslations } from "next-intl";

export function FaqSection({ className }: { className?: string }) {
	const t = useTranslations("main.faq");

	const items = [
		{
			question: t("01.question"),
			answer: t("01.answer"),
		},
		{
			question: t("02.question"),
			answer: t("02.answer"),
		},
		{
			question: t("03.question"),
			answer: t("03.answer"),
		},
		{
			question: t("04.question"),
			answer: t("04.answer"),
		},
		{
			question: t("05.question"),
			answer: t("05.answer"),
		},
		{
			question: t("06.question"),
			answer: t("06.answer"),
		},
	]

	if (!items) {
		return null;
	}

	return (
		<section
			className={cn("scroll-mt-20 border-t py-12 lg:py-16", className)}
			id="faq"
		>
			<div className="container max-w-7xl">
				<div className="mb-12 lg:text-center">
					<h2 className="mb-2 font-bold text-3xl lg:text-5xl">
						{t("title")}
					</h2>
					<p className="text-lg opacity-50">{t("subtitle")}</p>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					{items.map((item, i) => (
						<div
							key={`faq-item-${i}`}
							className="rounded-lg border p-4 lg:p-6"
						>
							<h3 className="mb-2 font-semibold text-lg">
								{item.question}
							</h3>
							<p className="text-foreground/60">{item.answer}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
