import { appConfig } from "@config";
import { ColorModeToggle, LocaleSwitch, Logo } from "@shared/components";
import { useLocale } from "next-intl";
import Link from "next-intl/link";
import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren<{}>) {
  const locale = useLocale();

  return (
    <>
      <div className="bg-muted text-foreground flex min-h-screen place-items-center">
        <div className="container">
          <div className="mx-auto grid w-full max-w-md gap-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="block">
                <Logo />
              </Link>

              <div className="flex items-center justify-end gap-2">
                <LocaleSwitch
                  locales={appConfig.i18n.locales}
                  currentLocale={locale}
                />
                <ColorModeToggle />
              </div>
            </div>

            <div className="bg-card text-card-foreground  rounded-2xl border p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
