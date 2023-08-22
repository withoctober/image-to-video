import { PageHeader, TabGroup } from "@saas/shared/components";
import { useTranslations } from "next-intl";
import { PropsWithChildren } from "react";

export default function SettingsLayout({ children }: PropsWithChildren<{}>) {
  const t = useTranslations();

  return (
    <div>
      <PageHeader
        title={t("settings.title")}
        subtitle={t("settings.subtitle")}
      />

      <div className="container py-6">
        <TabGroup
          items={["account", "team", "billing"].map((segment) => ({
            label: t(`settings.${segment}.title` as any),
            href: `${segment}`,
            segment,
          }))}
          className="mb-6"
        />

        {children}
      </div>
    </div>
  );
}
