import NextNProgress from 'nextjs-progressbar';
import tailwindConfig from '../../../tailwind.config';

export function ProgressBar() {
  const progressBarColor = (tailwindConfig.theme?.extend?.colors as any)?.primary[300] ?? undefined;
  return <NextNProgress height={4} color={progressBarColor} showOnShallow={true} />;
}
