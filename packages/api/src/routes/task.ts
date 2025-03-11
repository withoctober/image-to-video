import { BizException } from "@repo/utils";
import { Hono } from "hono";
import { validator } from "hono-openapi/zod";
import { z } from "zod";

export const taskRouter = new Hono().basePath("/task").post(
	"generate",
	validator(
		"json",
		z.object({
			prompt: z.string(),
			image: z.string().optional(),
			type: z.enum(["image-to-video", "text-to-video"]),
			organizationId: z.string().optional(),
		}),
	),
	async (c) => {
		const { prompt, image, type, organizationId } = c.req.valid("json");
		throw BizException(400, "Not implemented");
	},
);
