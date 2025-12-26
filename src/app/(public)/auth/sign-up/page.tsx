"use client";

import SignUpForm from "@/components/auth/SignUpForm";
import { useTranslation } from "@/stores/TranslationContext";
import Link from "next/link";

const SignUpPage = () => {
  const { t } = useTranslation();

  return (
    <div className="my-10 flex min-h-screen py-5 xl:my-0 xl:h-auto xl:py-0">
      <div className="relative p-5 min-w-[568px] min-h-[709px] before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md mx-auto my-auto w-full px-5 py-8 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-40 xl:w-auto xl:p-0 xl:before:hidden xl:after:hidden">
        <h3 className="text-center text-xl font-semibold xl:text-left xl:text-2xl">
          {t("createYourAccount")}
        </h3>
        <p className="mt-2 text-center text-slate-500 xl:text-left">
          {t("alreadyHaveAccount")}
          <Link
            href="/auth/sign-in"
            className="ml-2 text-primary hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
