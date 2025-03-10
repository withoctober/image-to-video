import { LocaleLink } from "@i18n/routing";
import { Button } from "@ui/components/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import heroImageDark from "../../../../public/images/hero-image-dark.png";
import heroImage from "../../../../public/images/hero-image.png";
import { useTranslations } from "next-intl";

export function Hero() {

	const t = useTranslations("main.hero");

	return (
		<div className="relative max-w-full overflow-x-hidden bg-linear-to-b from-0% from-card to-[50vh] to-background">
			<div className="absolute left-1/2 z-10 ml-[-500px] h-[500px] w-[1000px] rounded-full bg-linear-to-r from-primary to-bg opacity-20 blur-[150px]" />
			<div className="container relative z-20 pt-44 pb-12 text-center lg:pb-16">
				<h1 className="mx-auto max-w-7xl text-balance font-bold text-5xl lg:text-7xl">
					{t("title")}
				</h1>

				<p className="mx-auto mt-4 max-w-3xl text-balance text-foreground/60 text-lg">
					{t("description")}
				</p>

				<div className="mx-auto mt-16 max-w-5xl rounded-2xl border bg-card/50 p-2 shadow-lg dark:shadow-foreground/10">
					<Image
						src={heroImage}
						alt="Our application"
						className="block rounded-xl dark:hidden"
						priority
					/>
					<Image
						src={heroImageDark}
						alt="Our application"
						className="hidden rounded-xl dark:block"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
