"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useCreateOrganizationMutation } from "@saas/organizations/lib/api";
import { useRouter } from "@shared/hooks/router";
import { Button } from "@ui/components/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ui/components/form";
import { Input } from "@ui/components/input";
import { useToast } from "@ui/hooks/use-toast";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(3).max(32),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateOrganizationForm({
	defaultName,
}: {
	defaultName?: string;
}) {
	const t = useTranslations();
	const { toast } = useToast();
	const router = useRouter();
	const { setActiveOrganization } = useActiveOrganization();
	const createOrganizationMutation = useCreateOrganizationMutation();
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: defaultName ?? "",
		},
	});

	const onSubmit = form.handleSubmit(async ({ name }) => {
		try {
			const newOrganization = await createOrganizationMutation.mutateAsync({
				name,
			});

			if (!newOrganization) {
				throw new Error("Failed to create organization");
			}

			setActiveOrganization(newOrganization.id);
			router.replace("/app");

			toast({
				variant: "success",
				title: t("organizations.createForm.notifications.success"),
			});
		} catch (e) {
			toast({
				title: t("organizations.createForm.notifications.error"),
				variant: "error",
			});
		}
	});

	return (
		<div className="mx-auto w-full max-w-md py-12">
			<h1 className="font-extrabold text-2xl md:text-3xl">
				{t("organizations.createForm.title")}
			</h1>
			<p className="mt-2 mb-6 text-muted-foreground">
				{t("organizations.createForm.subtitle")}
			</p>

			<Form {...form}>
				<form onSubmit={onSubmit}>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("organizations.createForm.name")}</FormLabel>
								<FormControl>
									<Input {...field} autoComplete="email" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						className="mt-6 w-full"
						type="submit"
						loading={form.formState.isSubmitting}
					>
						{t("organizations.createForm.submit")}
					</Button>
				</form>
			</Form>
		</div>
	);
}
