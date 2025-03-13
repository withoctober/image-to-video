import { LocaleLink } from "@i18n/routing";
import { Logo } from "@shared/components/Logo";

export function Footer() {
	return (
		<footer className="border-t py-8 text-foreground/60 text-sm">
			<div className="container grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<Logo className="opacity-70 grayscale" />
					<p className="mt-3 text-sm opacity-70">
						© {new Date().getFullYear()} supastarter. All rights
						reserved.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<LocaleLink href="/blog" className="block">
						Blog
					</LocaleLink>

					<LocaleLink href="/pricing" className="block">
						Pricing
					</LocaleLink>
				</div>

				<div className="flex flex-col gap-2">
					<LocaleLink href="/legal/privacy-policy" className="block">
						Privacy policy
					</LocaleLink>

					<LocaleLink href="/legal/terms" className="block">
						Terms and conditions
					</LocaleLink>
				</div>
			</div>
		</footer>
	);
}
