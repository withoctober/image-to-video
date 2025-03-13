import { db } from "@repo/database";
import { SuccessResponse } from "@repo/utils";
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

export interface UserCredits {
	quota: number;
	used: number;
}

export const userRouter = new Hono()
	.basePath("/user")
	.get("/credits", authMiddleware, async (c) => {
		const user = c.get("user");
		const credit = await getCredits(user?.id);
		return c.json(SuccessResponse(credit));
	});

export const getCredits = async (userId: string): Promise<UserCredits> => {
	const purchase = await db.purchase.findFirst({
		where: {
			userId,
		},
	});

	// 获取赠送额度
	const gift = await db.creditTransaction.findMany({
		where: {
			userId,
			type: "GIFT",
			createdAt: {
				lte: new Date(),
			},
			expiresAt: {
				gte: new Date(),
			},
		},
	});

	const giftQuota = gift.reduce((acc, curr) => acc + curr.credit, 0);

	if (!purchase) {
		const count = await db.task.count({
			where: {
				userId,
				createdAt: {
					gte: new Date(new Date().setHours(0, 0, 0, 0)),
				},
				status: {
					notIn: ["FAIL", "INIT"],
				},
			},
		});
		return {
			quota: 0 + giftQuota,
			used: count * 10,
		};
	}

	// 付费用户, 获取额度
	const product = await db.product.findFirst({
		where: {
			productId: purchase.productId,
		},
	});

	// 获取当前周期开始时间
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
	const planDateAt = new Date(purchase.createdAt);
	while (planDateAt < thirtyDaysAgo) {
		planDateAt.setMonth(planDateAt.getMonth() + 1);
	}

	const used = await db.task.count({
		where: {
			userId,
			createdAt: {
				gte: planDateAt,
			},
			status: {
				notIn: ["FAIL", "INIT"],
			},
		},
	});

	return {
		quota: (product?.quota ?? 0) + giftQuota,
		used: used * 10,
	};
};
