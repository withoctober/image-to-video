import { TRPCError } from "@trpc/server";
import { db } from "database";
import { logger } from "logs";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";
import { defineAbilitiesFor } from "../../auth/abilities";
import { cancelSubscription as cancelSubscriptionResolver } from "../provider";

export const cancelSubscription = protectedProcedure
	.input(
		z.object({
			id: z.string(),
		}),
	)
	.mutation(async ({ input: { id }, ctx: { user } }) => {
		const subscription = await db.subscription.findUnique({
			where: {
				id,
			},
		});

		if (!subscription) {
			throw new TRPCError({
				code: "NOT_FOUND",
			});
		}

		const userAbilities = await defineAbilitiesFor(user);
		if (!userAbilities.isTeamOwner(subscription.teamId)) {
			throw new TRPCError({
				code: "FORBIDDEN",
			});
		}

		try {
			await cancelSubscriptionResolver({ id });

			await db.subscription.update({
				where: {
					id,
				},
				data: {
					status: "CANCELED",
				},
			});
		} catch (e) {
			logger.error(e);

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
			});
		}
	});
