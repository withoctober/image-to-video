"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/alert";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { AlertTriangleIcon, ArrowLeftIcon, MailboxIcon } from "lucide-react";

import { authClient } from "@repo/auth/client";
import { useRouter } from "@shared/hooks/router";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@ui/components/form";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
	const t = useTranslations();
	const router = useRouter();
	const [serverError, setServerError] = useState<null | {
		title: string;
		message: string;
	}>(null);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = form.handleSubmit(async ({ email }) => {
		try {
			const redirectTo = new URL(
				"/auth/reset-password",
				window.location.origin,
			).toString();

			const { error } = await authClient.forgetPassword({
				email,
				redirectTo,
			});

			if (error) {
				throw error;
			}
		} catch (e) {
			setServerError({
				title: t("auth.forgotPassword.hints.linkNotSent.title"),
				message: t("auth.forgotPassword.hints.linkNotSent.message"),
			});
		}
	});

	return (
		<>
			<h1 className="font-extrabold text-2xl md:text-3xl">
				{t("auth.forgotPassword.title")}
			</h1>
			<p className="mt-1 mb-6 text-muted-foreground">
				{t("auth.forgotPassword.message")}{" "}
			</p>

			{form.formState.isSubmitSuccessful ? (
				<Alert variant="success">
					<MailboxIcon className="size-6" />
					<AlertTitle>
						{t("auth.forgotPassword.hints.linkSent.title")}
					</AlertTitle>
					<AlertDescription>
						{t("auth.forgotPassword.hints.linkSent.message")}
					</AlertDescription>
				</Alert>
			) : (
				<Form {...form}>
					<form
						className="flex flex-col items-stretch gap-4"
						onSubmit={onSubmit}
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("auth.forgotPassword.email")}</FormLabel>
									<FormControl>
										<Input {...field} autoComplete="email" />
									</FormControl>
								</FormItem>
							)}
						/>

						{form.formState.isSubmitted && serverError && (
							<Alert variant="error">
								<AlertTriangleIcon className="size-6" />
								<AlertTitle>{serverError.title}</AlertTitle>
								<AlertDescription>{serverError.message}</AlertDescription>
							</Alert>
						)}

						<Button loading={form.formState.isSubmitting}>
							{t("auth.forgotPassword.submit")}
						</Button>
					</form>
				</Form>
			)}

			<div className="mt-6 text-center text-sm">
				<Link href="/auth/login">
					<ArrowLeftIcon className="mr-1 inline size-4 align-middle" />
					{t("auth.forgotPassword.backToSignin")}
				</Link>
			</div>
		</>
	);
}
