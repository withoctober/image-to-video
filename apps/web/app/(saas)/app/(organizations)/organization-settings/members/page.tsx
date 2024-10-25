import { getActiveOrganization } from "@saas/auth/lib/server";
import { InviteMemberForm } from "@saas/organizations/components/InviteMemberForm";
import { OrganizationMembersBlock } from "@saas/organizations/components/OrganizationMembersBlock";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("organizations.settings.title"),
	};
}

export default async function OrganizationSettingsPage() {
	const organization = await getActiveOrganization();

	if (!organization) {
		return notFound();
	}

	return (
		<div className="grid grid-cols-1 gap-6">
			<InviteMemberForm organizationId={organization.id} />
			<OrganizationMembersBlock organizationId={organization.id} />
		</div>
	);
}
