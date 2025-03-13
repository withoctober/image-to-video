import { apiClient } from "@shared/lib/api-client";
import { useQuery } from "@tanstack/react-query";

export const getCreditQueryKey = ["get-credit"] as const;
export const useGetCreditQuery = (enabled: boolean) => {
	return useQuery({
		enabled,
		queryKey: getCreditQueryKey,
		queryFn: async () => {
			const response = await apiClient.user.credits.$get();
			if (!response.ok) {
				throw new Error("Failed to get credit");
			}
			const data = await response.json();
			if (data.code !== 200) {
				throw new Error(data.message);
			}
			return data.data;
		},
	});
};
