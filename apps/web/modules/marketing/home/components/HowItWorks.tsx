import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("main.howItWorks");
  return (
    <section>
      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10 pt-12 lg:pt-48">
        {/* Title */}
        <div className="mx-auto mb-6 lg:mb-0 lg:max-w-5xl lg:text-center">
          <h2 className="font-bold text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-balance text-lg opacity-50">
            {t("subtitle")}
          </p>
        </div>
        {/* Content */}
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 mt-8 mb-4 ">
          {/* Item */}
          <div className="grid gap-4 rounded-md border border-solid border-gray-300 p-8 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <p className="text-sm font-bold sm:text-xl">1</p>
            </div>
            <h3 className="text-xl font-semibold">
              {t("step1.title")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("step1.description")}
            </p>
          </div>
          {/* Item */}
          <div className="grid gap-4 rounded-md border border-solid border-gray-300 p-8 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <p className="text-sm font-bold sm:text-xl">2</p>
            </div>
            <h3 className="text-xl font-semibold">
              {t("step2.title")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("step2.description")}
            </p>
          </div>
          {/* Item */}
          <div className="grid gap-4 rounded-md border border-solid border-gray-300 p-8 md:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <p className="text-sm font-bold sm:text-xl">3</p>
            </div>
            <h3 className="text-xl font-semibold">
              {t("step3.title")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("step3.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
