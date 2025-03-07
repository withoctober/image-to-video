import { cn } from "@ui/lib";
import Image from "next/image";
export function Logo({
	withLabel = true,
	className,
}: {
	className?: string;
	withLabel?: boolean;
}) {
	return (
		<span
			className={cn(
				"flex items-center font-semibold text-foreground leading-none",
				className,
			)}
		>
			<Image src="/images/logo.png" alt="Logo" width={32} height={32} />
			{withLabel && (
				<span className="ml-3 hidden text-lg md:block">acme</span>
			)}
		</span>
	);
}
