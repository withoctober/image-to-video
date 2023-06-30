import { Icon } from "ui";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Icon.spinner className="text-primary-400 h-4 w-4 animate-spin text-3xl" />
    </div>
  );
}
