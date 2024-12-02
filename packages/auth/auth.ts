import { config } from "@repo/config";
import { db } from "@repo/database";
import type { Locale } from "@repo/i18n";
import { logger } from "@repo/logs";
import { sendEmail } from "@repo/mail";
import { getBaseUrl } from "@repo/utils";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
	admin,
	magicLink,
	openAPI,
	organization,
	passkey,
	username,
} from "better-auth/plugins";
import { parse as parseCookies } from "cookie";
import { getUserByEmail } from "./lib/user";

const getLocaleFromRequest = (request?: Request) => {
	const cookies = parseCookies(request?.headers.get("cookie") ?? "");
	return (
		(cookies[config.i18n.localeCookieName] as Locale) ??
		config.i18n.defaultLocale
	);
};

const appUrl = getBaseUrl();

export const auth = betterAuth({
	baseURL: appUrl,
	trustedOrigins: [appUrl],
	database: prismaAdapter(db, {
		provider: "postgresql",
	}),
	session: {
		expiresIn: config.auth.sessionCookieMaxAge,
	},
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github"],
		},
	},
	user: {
		additionalFields: {
			onboardingComplete: {
				type: "boolean",
				required: false,
			},
			locale: {
				type: "string",
				required: false,
			},
		},
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async (
				{ user: { email, name }, url },
				request,
			) => {
				const locale = getLocaleFromRequest(request);
				await sendEmail({
					to: email,
					templateId: "emailVerification",
					context: {
						url,
						name,
					},
					locale,
				});
			},
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }, request) => {
			const locale = getLocaleFromRequest(request);
			await sendEmail({
				to: user.email,
				templateId: "forgotPassword",
				context: {
					url,
					name: user.name,
				},
				locale,
			});
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user: { email, name }, url }, request) => {
			const locale = getLocaleFromRequest(request);
			await sendEmail({
				to: email,
				templateId: "emailVerification",
				context: {
					url,
					name,
				},
				locale,
			});
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			scope: ["email", "profile"],
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			scope: ["user:email"],
		},
	},
	plugins: [
		username(),
		admin(),
		passkey(),
		magicLink({
			disableSignUp: true,
			sendMagicLink: async ({ email, url }, request) => {
				const locale = getLocaleFromRequest(request);
				await sendEmail({
					to: email,
					templateId: "magicLink",
					context: {
						url,
					},
					locale,
				});
			},
		}),
		organization({
			sendInvitationEmail: async (
				{ email, id, organization, inviter },
				request,
			) => {
				const locale = getLocaleFromRequest(request);
				const existingUser = await getUserByEmail(email);

				const url = new URL(
					existingUser ? "/auth/login" : "/auth/signup",
					getBaseUrl(),
				);

				url.searchParams.set("invitationId", id);
				url.searchParams.set("email", email);

				await sendEmail({
					to: email,
					templateId: "organizationInvitation",
					locale,
					context: {
						organizationName: organization.name,
						url: url.toString(),
					},
				});
			},
		}),
		openAPI(),
	],
	onAPIError: {
		onError(error, ctx) {
			logger.error(error, { ctx });
		},
	},
});

export * from "./lib/organization";

export type Session = typeof auth.$Infer.Session;

export type ActiveOrganization = typeof auth.$Infer.ActiveOrganization;

export type Organization = typeof auth.$Infer.Organization;

export type OrganizationMemberRole = typeof auth.$Infer.Member.role;

export type OrganizationInvitationStatus = typeof auth.$Infer.Invitation.status;

export type OrganizationMetadata = Record<string, unknown> | undefined;
