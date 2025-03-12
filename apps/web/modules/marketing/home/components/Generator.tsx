"use client";

import type React from "react";

import { useSession } from "@saas/auth/hooks/use-session";
import { Button } from "@ui/components/button";
import { } from "@ui/components/tabs";
import { Textarea } from "@ui/components/textarea";
import imageCompression from "browser-image-compression";
import { Download, Loader2, Share, Trash2, Upload, Wand2, } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/components/tooltip";
import { useTaskGenerateMutation, useTaskQuery } from "@marketing/home/lib/api";

export default function Generator() {
	const [prompt, setPrompt] = useState("");
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isGenerateLoading, setIsGenerateLoading] = useState(false);
	const [isSubmitLoading, setIsSubmitLoading] = useState(false);
	const [output, setOutput] = useState<{
		imageUrl?: string;
		videoUrl?: string;
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

	const { data: taskData, isLoading: isTaskLoading, isError: isTaskError, refetch: refetchTask } = useTaskQuery(output?.taskId || "");

	useEffect(() => {
		if (taskData?.status === "SUCCESS") {
			setOutput(prev => {
				if (!prev) return prev;
				return {
					...prev,
					videoUrl: taskData.videoUrl || undefined,
				};
			});
		}
	}, [taskData]);



	const taskGenerateMutation = useTaskGenerateMutation();
	const handleGenerate = async () => {
		if (!prompt) {
			toast.error("请输入提示词");
			return;
		}

		if (!uploadedImage) {
			toast.error("请上传图片");
			return;
		}

		setIsSubmitLoading(true);

		try {
			const res = await taskGenerateMutation.mutateAsync({
				prompt,
				image: uploadedImage,
				type: "image-to-video",
			});

			setOutput({
				taskId: res.taskId,
				imageUrl: res.imageUrl,
				progress: 0,
			});
			setIsGenerateLoading(true);


		} catch (error: any) {
			console.error(error);
			toast.error(error.message);
		} finally {
			setIsSubmitLoading(false);
		}


		// setOutput({
		// 	imageUrl: "/images/home/coastline.webp",
		// 	taskId: "task-" + Date.now(),
		// 	progress: 0,
		// });

		// // Simulate progress updates
		// const progressInterval = setInterval(() => {
		// 	setOutput((prev) => {
		// 		if (!prev) return prev;

		// 		const newProgress = Math.min(prev.progress + 10, 100);

		// 		// When progress reaches 100%, clear the interval and set loading to false
		// 		if (newProgress >= 100) {
		// 			clearInterval(progressInterval);
		// 			setOutput((prev) => {
		// 				if (!prev) return prev;

		// 				return {
		// 					...prev,
		// 					progress: 100,
		// 					videoUrl: "http://storage.imagevideo.org/examples/coastline.mp4",
		// 				};
		// 			});
		// 			setTimeout(() => {
		// 				setIsGenerateLoading(false);
		// 			}, 500);
		// 		}

		// 		return {
		// 			...prev,
		// 			progress: newProgress,
		// 		};
		// 	});
		// }, 1000);

		// // Cleanup interval on component unmount
		// return () => clearInterval(progressInterval);
	}

	const ExampleVideo = useCallback(() => (
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
	), []);

	const PrviewVideo = useCallback(() => (
		<div className="flex flex-col justify-start items-center h-full">
			<div className="h-[250px] lg:h-[350px] rounded-lg relative">
				{
					output?.videoUrl ? (
						<video
							src="http://storage.imagevideo.org/examples/coastline.mp4"
							controls
							aria-label="CoastlineVideoPreview"
							className="w-full rounded-lg"
						>
							<track kind="captions" label="中文" srcLang="zh" src="/path/to/captions.vtt" />
						</video>
					) : (
						<div className="relative bg-muted rounded-lg h-[250px] lg:h-[350px]">
							<img src={output?.imageUrl || "/images/home/coastline.webp"} alt="GeneratedImage" className="w-full rounded-lg  h-[250px] lg:h-[350px]" />
							{isGenerateLoading && (
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-lg">
									<Loader2 className="h-10 w-10 text-white animate-spin mb-2" />
									<div className="text-white text-sm font-medium">生成中 {output?.progress || 0}%</div>
								</div>
							)}
						</div>
					)
				}
			</div>
			{
				output?.videoUrl && (
					<div className="w-full flex items-center justify-center gap-2 mt-8">
						<Button variant="outline" size="sm" className="w-48 mt-2">
							<Download className="h-4 w-4" />
							下载视频
						</Button>
						<Button variant="outline" size="sm" className="w-48 mt-2">
							<Share className="h-4 w-4" />
							分享视频
						</Button>
					</div>
				)
			}
		</div>
	), [output, isGenerateLoading]);

	return (
		<div className="max-w-7xl mx-auto min-h-[1200px] lg:min-h-[800px]">
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

												<TooltipProvider delayDuration={30}>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="flex items-center gap-1 text-primary px-2 "
															>
																<Wand2 className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Add to library</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>

												<TooltipProvider delayDuration={30}>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button
																variant="ghost"
																size="sm"
																className="flex items-center gap-1 text-primary px-2"
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Add to library</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
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
								disabled={isSubmitLoading}
								onClick={handleGenerate}
							>
								{isSubmitLoading ? (
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
					<div className="space-y-4 col-span-5 mt-10 lg:mt-0 h-[400px]">
						<div className="space-y-2 flex flex-start">
							<h3 className="text-xl font-medium">
								{t("previewVideo")}
							</h3>
						</div>
						<div className="mt-6 lg:mt-16 relative h-[250px] lg:h-[350px]">
							{!output ? (
								<ExampleVideo />
							) : (
								<PrviewVideo />
							)}
						</div>
					</div>
				</div>
			</div >
		</div >
	);
}
