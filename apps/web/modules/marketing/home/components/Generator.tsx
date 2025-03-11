"use client";

import type React from "react";

import { useSession } from "@saas/auth/hooks/use-session";
import { Button } from "@ui/components/button";
import { } from "@ui/components/tabs";
import { Textarea } from "@ui/components/textarea";
import imageCompression from "browser-image-compression";
import { Download, Loader2, Trash2, Upload, Wand2, } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

export default function Generator() {
	const [prompt, setPrompt] = useState("");
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isGenerateLoading, setIsGenerateLoading] = useState(false);
	const [output, setOutput] = useState<{
		url: string;
		taskId: string;
		progress: number;
	} | null>(null);
	const { user, reloadSession } = useSession();

	const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

	const t = useTranslations("generator");

	const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	// 压缩base64图片
	const compressImage = async (base64: string) => {
		try {
			// 1. 从Base64提取MIME类型（如'image/png'）
			const mimeType =
				base64.match(/data:(.*?);base64/)?.[1] || "image/png";

			// 2. 将Base64转为二进制Blob
			const byteString = atob(base64.split(",")[1]);
			const arrayBuffer = new ArrayBuffer(byteString.length);
			const uintArray = new Uint8Array(arrayBuffer);
			for (let i = 0; i < byteString.length; i++) {
				uintArray[i] = byteString.charCodeAt(i);
			}
			const blob = new Blob([uintArray], { type: mimeType });

			// 3. 创建File对象（推荐保留原始文件名或动态生成）
			const file = new File([blob], "compressed_image", {
				type: mimeType,
			});

			// 4. 设置压缩选项（按需调整参数）
			const options = {
				maxSizeMB: 1, // 目标压缩大小
				maxWidthOrHeight: 768, // 限制宽/高
				useWebWorker: true, // 多线程加速
				fileType: "image/webp", // 可选：更改为WebP格式进一步压缩
				initialQuality: 0.8, // 初始质量
			};

			// 5. 执行压缩
			const compressedFile = await imageCompression(file, options);

			// 6. 将压缩后的文件转为base64
			return await fileToBase64(compressedFile);
		} catch (error) {
			console.error("图片压缩失败:", error);
			return base64; // 可改为返回原始文件作为降级方案
		}
	};

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setUploadedImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	function ExampleVideo() {
		return (
			<div className="relative h-full w-full">
				<img
					src="/images/home/coastline.webp"
					alt="CoastlinePhoto"
					className="absolute top-0 left-0 w-[220px] lg:w-[350px] rounded-lg"
				/>
				<video
					src="http://storage.imagevideo.org/examples/coastline.mp4"
					controls
					className="absolute bottom-0 right-0 w-[220px] lg:w-[350px] rounded-lg"
					aria-label="CoastlineVideoPreview"
				>
					<track kind="captions" label="中文" srcLang="zh" src="/path/to/captions.vtt" />
				</video>
			</div>
		)
	}


	return (
		<div className="max-w-7xl mx-auto">
			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<div className="space-y-2 flex flex-start">
					<h2 className="text-xl font-bold">
						{t("title")}
					</h2>
				</div>
				<div className="mt-6 grid grid-cols-1 md:grid-cols-11 gap-1">
					{/* Input Image Section (Left) */}
					<div className="space-y-6 col-span-5">
						<div className="space-y-2 flex flex-start">
							<h3 className="text-lg font-medium">
								{t("image")}
							</h3>
						</div>
						<div
							className="flex h-[250px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed overflow-hidden bg-muted"
							onClick={triggerFileInput}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									triggerFileInput();
								}
							}}
						>
							{uploadedImage ? (
								<div className="w-full h-full flex items-center justify-center">
									<img
										src={
											uploadedImage ||
											"/placeholder.svg"
										}
										alt="Uploaded"
										className="max-w-full max-h-full object-contain"
									/>
								</div>
							) : (
								<div className="flex flex-col items-center gap-2 text-center">
									<Upload className="h-8 w-8 text-muted-foreground" />
									<p className="text-sm text-muted-foreground">
										{t("uploadTips")}
									</p>
								</div>
							)}
							<input
								type="file"
								ref={fileInputRef}
								className="hidden"
								accept="image/*"
								onChange={handleFileUpload}
							/>
						</div>
						<div className="space-y-4">
							<div className="space-y-2">
								<h3 className="text-lg font-medium flex justify-start">
									{t("prompt")}
								</h3>
								<div className="relative">
									<Textarea
										value={prompt}
										onChange={(e) => setPrompt(e.target.value)}
										className="min-h-[150px] resize-none bg-muted mb-0"
									/>
									<div className="absolute bottom-1 w-full px-2">
										<div className=" flex items-center justify-between bg-muted">
											<div className="flex gap-1">
												<Button
													variant="ghost"
													size="sm"
													className="flex items-center gap-1 text-primary"
												>
													<Wand2 className="h-4 w-4" />
													<span>AI Rewrite</span>
												</Button>

												<Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary">
													<Trash2 className="h-4 w-4" />
													<span>Clear</span>
												</Button>
											</div>
											<div className="text-muted-foreground text-sm">
												{prompt.length}/{500}
											</div>
										</div>
									</div>
								</div>
							</div>
							{user && (
								<div className="flex justify-end">
								</div>
							)}
							<Button
								className="w-full h-8 primary text-white hover:primary"
								disabled={isGenerateLoading}
							>
								{isGenerateLoading ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Upload className="mr-2 h-4 w-4" />
								)}
								{t("generateButton")}
							</Button>
						</div>
					</div>
					<div className="col-span-1 flex lg:block w-full items-center justify-center">
						<div className="w-[1px] h-full border-r border-dashed border-gray-200 hidden md:block mx-auto" />
					</div>
					<div className="space-y-4 col-span-5">
						<div className="space-y-2 flex flex-start">
							<h3 className="text-xl font-medium">
								{t("previewVideo")}
							</h3>
						</div>
						<div className="mt-8 lg:mt-16 relative h-[250px] lg:h-[350px]">
							{!output ? (
								<ExampleVideo />
							) : (
								<div className="flex justify-center items-center h-full">
									<p className="text-muted-foreground">暂无预览</p>
									<Button variant="outline" size="sm" className="w-full mt-2">
										<Download className="h-4 w-4" />
										下载视频
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div >
		</div >
	);
}
