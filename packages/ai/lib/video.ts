import { BizException } from "@repo/utils";
import axios from "axios";

export async function generateVideo(
	prompt: string,
	image: string,
	promptOptimizer: boolean,
) {
	try {
		const res = await axios({
			method: "post",
			url: "https://api.minimax.chat/v1/video_generation",
			headers: {
				Authorization: `Bearer ${process.env.MINIMAXI_API_KEY}`,
				"Content-Type": "application/json",
			},
			data: {
				model: "I2V-01-live",
				prompt: prompt,
				first_frame_image: image,
				prompt_optimizer: promptOptimizer,
				callback_url: process.env.MINIMAXI_CALLBACK_URL,
			},
		});
		console.log(res.data);
		if (!res.data?.task_id) {
			throw BizException(500, "Failed to generate video");
		}
		return res.data;
	} catch (error) {
		throw BizException(500, "Failed to generate video");
	}
}

export async function retrieveVideo(fileId: string) {
	try {
		const res = await axios({
			method: "get",
			url: `https://api.minimax.chat/v1/files/retrieve?GroupId=${process.env.MINIMAXI_GROUP_ID}&file_id=${fileId}`,
			headers: {
				Authorization: `Bearer ${process.env.MINIMAXI_API_KEY}`,
				"Content-Type": "application/json",
			},
		});
		console.log(res.data);
		return res.data;
	} catch (error) {
		throw BizException(500, "Failed to retrieve video");
	}
}
