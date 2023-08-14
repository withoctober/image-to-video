"use client";

import { useUser } from "@lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthView } from "../types";
import CallbackLoader from "./CallbackLoader";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export const Auth = ({ view }: { view: AuthView }) => {
  const { user, loaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!Object.keys(AuthView).includes(view)) {
    router.replace("/auth/login");
  }

  const redirectToParam = searchParams.get("redirectTo");

  if (loaded && user) {
    router.replace("/auth/gateway");
  }

  if (!view) return null;

  switch (view) {
    case "signup":
      return <SignupForm />;

    case "forgot-password":
      return <ForgotPasswordForm />;

    case "callback":
      return <CallbackLoader />;

    default:
      return <LoginForm />;
  }
};
