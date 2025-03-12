import { apiClient } from "@shared/lib/api-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { InferRequestType } from "hono";

export const newsletterSignupMutationKey = ["newsletter-signup"] as const;
export const useNewsletterSignupMutation = () => {
	return useMutation({
		mutationKey: newsletterSignupMutationKey,
		mutationFn: async (
			form: InferRequestType<
				typeof apiClient.newsletter.signup.$post
			>["form"],
		) => {
			const response = await apiClient.newsletter.signup.$post({
				form,
			});

			if (!response.ok) {
				throw new Error("Failed to sign up to newsletter");
			}
		},
	});
};

export const contactFormMutationKey = ["contact-form"] as const;
export const useContactFormMutation = () => {
	return useMutation({
		mutationKey: contactFormMutationKey,
		mutationFn: async (
			form: InferRequestType<typeof apiClient.contact.$post>["form"],
		) => {
			const response = await apiClient.contact.$post({
				form,
			});

			if (!response.ok) {
				throw new Error("Failed to send contact form");
			}
		},
	});
};

export const useTaskGenerateMutationKey = ["task-generate"] as const;
export const useTaskGenerateMutation = () => {
	return useMutation({
		mutationKey: useTaskGenerateMutationKey,
		mutationFn: async (
			form: InferRequestType<
				typeof apiClient.task.generate.$post
			>["json"],
		) => {
			const response = await apiClient.task.generate.$post({
				json: form,
			});

			if (!response.ok) {
				throw new Error("Failed to generate task");
			}

			const data = await response.json();
			if (data.code !== 200) {
				throw new Error(data.message);
			}
			return data.data;
		},
	});
};

export const useTaskQueryKey = ["task-query"] as const;
export const useTaskQuery = (id: string, enabled: boolean) => {
	return useQuery({
		queryKey: useTaskQueryKey,
		queryFn: async () => {
			const response = await apiClient.task[":id"].$get({
				param: {
					id,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch task");
			}

			const data = await response.json();
			if (data.code !== 200) {
				throw new Error(data.message);
			}

			return data.data;
		},
		refetchInterval: 5000,
		refetchIntervalInBackground: false,
		retry: 30,
		enabled: !!id && enabled,
	});
};
