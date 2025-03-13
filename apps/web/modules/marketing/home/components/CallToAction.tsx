import { useTranslations } from "next-intl";

export function CallToAction() {
    const t = useTranslations("main.callToAction");
    return (
        <section>
            {/* Container */}
            <div className="px-5 py-16 md:px-10 md:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 py-32 text-center">
                    {/* Title */}
                    <h2 className="mx-auto mb-6 max-w-3xl flex-col text-3xl font-bold md:mb-10 md:text-5xl lg:mb-12 md:leading-snug">
                        {t("title")}
                    </h2>
                    <p className="mx-auto mb-8 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8 md:gap-10 lg:mb-12">
                        {t("description")}
                    </p>
                    <a href="#generator" className="mb-4 inline-block items-center bg-black px-6 py-3 text-center font-semibold text-white">
                        {t("button")}
                    </a>
                </div>
            </div>
        </section>
    );
}
