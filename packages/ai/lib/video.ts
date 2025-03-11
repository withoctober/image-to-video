import { BizException } from "@repo/utils";
import axios from "axios";

export async function generateVideo(prompt: string, image: string) {
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
			},
		});
		return res.data;
	} catch (error) {
		throw BizException(500, "Failed to generate video");
	}
}
