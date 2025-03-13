import { SocialSigninButton } from "@saas/auth/components/SocialSigninButton";
import { Dialog, DialogContent, DialogTitle } from "@ui/components/dialog";
import { useTranslations } from "next-intl";

export function LoginPopup({
	open,
	onClose,
	redirect,
}: {
	open: boolean;
	onClose: () => void;
	redirect?: string;
}) {
	const t = useTranslations("components.loginPopup");

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent aria-label="Login Popup">
				<DialogTitle>{t("title")}</DialogTitle>
				<p className="text-sm text-muted-foreground">{t("subtitle")}</p>
				<SocialSigninButton provider="google" redirect={redirect} />
			</DialogContent>
		</Dialog>
	);
}
