
import { ArrowDownIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

export function Hero() {

	const t = useTranslations("main.hero");

	return (
		<section className="mx-auto w-full max-w-7xl py-16 lg:pt-30 lg:pb-48">
			<div className="grid grid-cols-1 grid-rows-2 items-center justify-items-start gap-8 sm:gap-16 lg:grid-cols-2 lg:grid-rows-1 mt-20 px-6 lg:px-0">
				<div className="flex flex-col">
					<h1 className="mb-4 text-4xl font-bold md:text-6xl md:leading-tight">
						{t("title")}
					</h1>
					<p className="mb-6 max-w-lg text-sm text-gray-500 sm:text-xl md:mb-10 lg:mb-12">
						{t("description")}
					</p>
					<div className="flex items-center mt-10">
						<a href="/#generator" className="flex mr-5 gap-2 items-center rounded-md bg-black px-6 py-3 font-semibold text-white md:mr-6 lg:mr-8">
							{t("getStartedButton")}
							<ArrowRightIcon className="w-4 h-4" />
						</a>
					</div>
				</div>
				<div className="flex flex-col w-full">
					<div className="grid grid-cols-11 gap-2">
						<div className="col-span-12 lg:col-span-5">
							<img src="/images/home/astronaut.webp" alt="astronaut" className="w-full h-full object-cover" />
						</div>
						<div className="col-span-12 lg:col-span-1 flex flex-col items-center justify-center">
							<ArrowRightIcon className="w-8 h-8  hidden lg:block" />
							<ArrowDownIcon className="w-8 h-8 block lg:hidden" />

						</div>
						<div className="col-span-12 lg:col-span-5">
							<video src="/images/home/astronaut.mp4" autoPlay muted loop className="w-full h-full object-cover" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
