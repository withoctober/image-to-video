import { generateVideo } from "@repo/ai";
import { db } from "@repo/database";
import { uploadFile } from "@repo/storage";
import { BadRequestResponse, SuccessResponse } from "@repo/utils";
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
			promptOptimizer: z.boolean().optional(),
		}),
	),
	async (c) => {
		const { prompt, image, type, promptOptimizer } = c.req.valid("json");

		if (type === "image-to-video" && !image) {
			return c.json(BadRequestResponse("image is required"));
		}
		const task = await db.task.create({
			data: {
				prompt,
				model: "I2V-01-live",
				type,
				status: "PREPARING",
			},
		});

		// 上传图片到s3
		// 将base64转为图片文件
		const imageFile = base64ToBuffer(image || "");
		const path = `images/task-${task.id}.png`;
		await uploadFile(process.env.S3_BUCKET_NAME || "", path, imageFile);

		// const video = await generateVideo(prompt, image || "", promptOptimizer || true);

		await db.task.update({
			where: { id: task.id },
			data: {
				// upstreamTaskId: video?.taskId,
				image: process.env.S3_PUBLIC_ENDPOINT + "/" + path,
				status: "PREPARING",
			},
		});

		return c.json(SuccessResponse({
			taskId: task.id,
			status: "PREPARING",
			imageUrl: process.env.S3_PUBLIC_ENDPOINT + "/" + path,
		}));
	},
).post("/callback", async (c) => {
	const body = await c.req.json();
	console.log(body);
	if (body?.challenge) {
		return c.json({
			challenge: body.challenge,
		});
	}
	if (body?.task_id) {
		if (body?.status === "Processing") {
			await db.task.update({
				where: { id: body.task_id },
				data: { status: "PROCESSING" },
			});
		} else if (body?.status === "Failed") {
			await db.task.update({
				where: { id: body.task_id },
				data: { status: "FAIL" },
			});
		} else if (body?.status === "Success") {
			// 这里去获取视频下载链接
		}
	}
})
.get("/:id", async (c) => {
	const { id } = c.req.param();
	const task = await db.task.findUnique({
		where: { id },
	});
	return c.json(SuccessResponse(task));
});



function base64ToBuffer(base64: string): Buffer {
	const mimeType = "image/png";
	const byteString = atob(base64.split(",")[1]);
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const uintArray = new Uint8Array(arrayBuffer);
	for (let i = 0; i < byteString.length; i++) {
		uintArray[i] = byteString.charCodeAt(i);
	}
	return Buffer.from(uintArray);
}