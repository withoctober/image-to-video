import { generateVideo, retrieveVideo } from "@repo/ai";
import { db } from "@repo/database";
import { uploadFile } from "@repo/storage";
import { BadRequestResponse, SuccessResponse } from "@repo/utils";
import { Hono } from "hono";
import { validator } from "hono-openapi/zod";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth";
import { getCredits } from "./user";

export const taskRouter = new Hono()
	.basePath("/task")
	.post(
		"generate",
		authMiddleware,
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
			const { prompt, image, type, promptOptimizer } =
				c.req.valid("json");

			const user = c.get("user");
			const credits = await getCredits(user.id);
			if (credits.used >= credits.quota) {
				return c.json(BadRequestResponse("credits not enough"));
			}

			if (type === "image-to-video" && !image) {
				return c.json(BadRequestResponse("image is required"));
			}
			const task = await db.task.create({
				data: {
					userId: user.id,
					prompt,
					model: "I2V-01-live",
					type,
					status: "INIT",
				},
			});

			// 上传图片到s3
			// 将base64转为图片文件
			const imageFile = base64ToBuffer(image || "");
			const path = `images/task-${task.id}.png`;
			await uploadFile(process.env.S3_BUCKET_NAME || "", path, imageFile);

			let video: any;
			try {
				video = await generateVideo(
					prompt,
					image || "",
					promptOptimizer || true,
				);
			} catch (error) {
				console.error(error);
				await db.task.update({
					where: { id: task.id },
					data: { status: "FAIL" },
				});
				return c.json(BadRequestResponse("generate video failed"));
			}

			await db.task.update({
				where: { id: task.id },
				data: {
					upstreamTaskId: String(video?.task_id),
					image: `${process.env.S3_PUBLIC_ENDPOINT}/${path}`,
					status: "PREPARING",
				},
			});

			return c.json(
				SuccessResponse({
					taskId: task.id,
					status: "PREPARING",
					imageUrl: `${process.env.S3_PUBLIC_ENDPOINT}/${path}`,
				}),
			);
		},
	)
	.post("/callback", async (c) => {
		const body = await c.req.json();
		console.log(body);
		if (body?.challenge) {
			return c.json({
				challenge: body.challenge,
			});
		}
		if (body?.task_id) {
			if (body?.status === "processing") {
				await db.task.updateMany({
					where: { upstreamTaskId: String(body.task_id) },
					data: { status: "PROCESSING" },
				});
			} else if (body?.status === "fail") {
				await db.task.updateMany({
					where: { upstreamTaskId: String(body.task_id) },
					data: { status: "FAIL" },
				});
			} else if (body?.status === "success") {
				// 先更新状态, 把file_id存入数据库
				await db.task.updateMany({
					where: { upstreamTaskId: String(body.task_id) },
					data: { fileId: body.file_id },
				});
				// 获取视频下载链接
				const video = await retrieveVideo(body.file_id);
				// 将视频转存到s3
				const videoFile = await downloadFile(video?.file?.download_url);
				const videoPath = `videos/task-${body.task_id}.mp4`;
				await uploadFile(
					process.env.S3_BUCKET_NAME || "",
					videoPath,
					videoFile,
				);
				// 更新视频下载链接
				await db.task.updateMany({
					where: { upstreamTaskId: String(body.task_id) },
					data: {
						videoUrl: `${process.env.S3_PUBLIC_ENDPOINT}/${videoPath}`,
						status: "SUCCESS",
					},
				});
				console.log(
					"id: ",
					body.task_id,
					"success: ",
					`${process.env.S3_PUBLIC_ENDPOINT}/${videoPath}`,
				);
			}
		}
		return c.json(SuccessResponse("success"));
	})
	.get("/:id", async (c) => {
		const { id } = c.req.param();
		const task = await db.task.findUnique({
			where: { id },
		});
		return c.json(SuccessResponse(task));
	});

function base64ToBuffer(base64: string): Buffer {
	const byteString = atob(base64.split(",")[1]);
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const uintArray = new Uint8Array(arrayBuffer);
	for (let i = 0; i < byteString.length; i++) {
		uintArray[i] = byteString.charCodeAt(i);
	}
	return Buffer.from(uintArray);
}

async function downloadFile(url: string): Promise<Buffer> {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	return Buffer.from(arrayBuffer);
}
