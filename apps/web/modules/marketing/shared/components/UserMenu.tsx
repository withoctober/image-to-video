"use client";
import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { useSession } from "@saas/auth/hooks/use-session";
import { UserAvatar } from "@shared/components/UserAvatar";
import { useRouter } from "@shared/hooks/router";
import { clearCache } from "@shared/lib/cache";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import {
	Bookmark,
	LogOutIcon,
	MoreVerticalIcon,
	SettingsIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function UserMenu({
	showUserName,
}: {
	showUserName?: boolean;
}) {

	const router = useRouter();
	const t = useTranslations("components.userMenu");
	const { user, reloadSession } = useSession();

	const onLogout = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					await clearCache();
					await reloadSession();
					router.push(config.auth.redirectAfterLogout);
				},
			},
		});
	};

	if (!user) {
		return null;
	}

	const { name, email, image } = user;

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center justify-between gap-2 rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-primary md:w-[100%+1rem] md:p-2 md:hover:bg-primary/5"
					aria-label="User menu"
				>
					<span className="flex items-center gap-2">
						<UserAvatar name={name ?? ""} avatarUrl={image} />
						{showUserName && (
							<span className="text-left leading-tight">
								<span className="font-medium text-sm">
									{name}
								</span>
								<span className="block text-xs opacity-70">
									{email}
								</span>
							</span>
						)}
					</span>

					{showUserName && <MoreVerticalIcon className="size-4" />}
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuLabel>
					{name}
					<span className="block font-normal text-xs opacity-70">
						{email}
					</span>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem asChild>
					<Link href="/app/settings/general">
						<SettingsIcon className="mr-2 size-4" />
						{t("accountSettings")}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/app/settings/billing">
						<Bookmark className="mr-2 size-4" />
						{t("billing")}
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={onLogout}>
					<LogOutIcon className="mr-2 size-4" />
					{t("logout")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
