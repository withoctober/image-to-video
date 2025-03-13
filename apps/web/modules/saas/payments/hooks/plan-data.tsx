import type { config } from "@repo/config";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type ProductReferenceId = keyof (typeof config)["payments"]["plans"];

export function usePlanData() {
	const t = useTranslations();

	const planData: Record<
		ProductReferenceId,
		{
			title: string;
			description: ReactNode;
			features: ReactNode[];
		}
	> = {
		free: {
			title: "Free",
			description: "Free",
			features: [],
		},
		trial: {
			title: t("pricing.products.trial.title"),
			description: t("pricing.products.trial.description"),
			features: [
				t("pricing.products.trial.features.quota"),
				t("pricing.products.trial.features.maxVideoNumber"),
				t("pricing.products.trial.features.maxImageNumber"),
				t("pricing.products.trial.features.ImageToVideoSupport"),
				t("pricing.products.trial.features.aiVideoEnhancement"),
				t("pricing.products.trial.features.videoDownload"),
				t("pricing.products.trial.features.videoShare"),
				t("pricing.products.trial.features.watermark"),
				t("pricing.products.trial.features.copyProtection"),
				t("pricing.products.trial.features.prioritySupport"),
			],
		},
		basic: {
			title: t("pricing.products.basic.title"),
			description: t("pricing.products.basic.description"),
			features: [
				t("pricing.products.basic.features.quota"),
				t("pricing.products.basic.features.maxVideoNumber"),
				t("pricing.products.basic.features.maxImageNumber"),
				t("pricing.products.basic.features.ImageToVideoSupport"),
				t("pricing.products.basic.features.aiVideoEnhancement"),
				t("pricing.products.basic.features.videoDownload"),
				t("pricing.products.basic.features.videoShare"),
				t("pricing.products.basic.features.watermark"),
				t("pricing.products.basic.features.copyProtection"),
				t("pricing.products.basic.features.prioritySupport"),
			],
		},
		pro: {
			title: t("pricing.products.pro.title"),
			description: t("pricing.products.pro.description"),
			features: [
				t("pricing.products.pro.features.quota"),
				t("pricing.products.pro.features.maxVideoNumber"),
				t("pricing.products.pro.features.maxImageNumber"),
				t("pricing.products.pro.features.ImageToVideoSupport"),
				t("pricing.products.pro.features.aiVideoEnhancement"),
				t("pricing.products.pro.features.videoDownload"),
				t("pricing.products.pro.features.videoShare"),
				t("pricing.products.pro.features.watermark"),
				t("pricing.products.pro.features.copyProtection"),
				t("pricing.products.pro.features.prioritySupport"),
			],
		}
	};

	return { planData };
}
