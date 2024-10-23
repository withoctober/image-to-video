import { TRPCError } from "@trpc/server";
import { db } from "database";
import { logger } from "logs";
import { z } from "zod";
import { protectedProcedure } from "../../../trpc/base";
import { defineAbilitiesFor } from "../../auth/abilities";
import { pauseSubscription as pauseSubscriptionResolver } from "../provider";

export const pauseSubscription = protectedProcedure
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
			await pauseSubscriptionResolver({ id });

			await db.subscription.update({
				where: {
					id,
				},
				data: {
					status: "PAUSED",
				},
			});
		} catch (e) {
			logger.error(e);

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
			});
		}
	});
