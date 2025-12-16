"use client";

import SignInForm from "@/components/auth/SignInForm";
import { useTranslation } from "@/stores/TranslationContext";

const SignInPage = () => {
  const { t } = useTranslation();

  return (
    <div className="my-10 flex min-h-screen py-5 xl:my-0 xl:h-auto xl:py-0">
      {/* <div className="relative p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md mx-auto my-auto w-full px-5 py-8 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-24 xl:w-auto xl:p-0 xl:before:hidden xl:after:hidden"> */}
      <div className="relative p-5 before:absolute before:inset-0 before:mx-3 before:-mb-3 before:border before:border-foreground/10 before:bg-background/30 before:shadow-[0px_3px_5px_#0000000b] before:z-[-1] before:rounded-xl after:absolute after:inset-0 after:border after:border-foreground/10 after:bg-background after:shadow-[0px_3px_5px_#0000000b] after:rounded-xl after:z-[-1] after:backdrop-blur-md mx-auto my-auto w-full px-5 py-8 sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-40 xl:w-auto xl:before:hidden xl:after:hidden">
        <h3 className="text-center text-xl font-semibold xl:text-left xl:text-2xl">
          {t("signIn")}
        </h3>
        <div className="mt-2 text-center opacity-70 xl:hidden">
          A few more clicks to sign in to your account. Manage all your
          e-commerce accounts in one place
        </div>
        <SignInForm />
        <div className="mt-10 text-center opacity-70 xl:mt-24 xl:text-left">
          © 2025<span className="text-primary m-[0.25rem]">Sagita</span>
          {t("allRightsReserved")}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
