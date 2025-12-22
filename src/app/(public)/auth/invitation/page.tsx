"use client";

import { verifyInvitationAction } from "@/actions/auth.actions";
import CompleteInvitationForm from "@/components/auth/CompleteInvitationForm";
import LoadingIcon from "@/components/common/ui/LoadingIcon";
import { getAuthenticatedUser } from "@/lib/session";
import { VerifyInvitationResponse } from "@/services/auth/auth.types";
import { useTranslation } from "@/stores/TranslationContext";
import { App } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const InvitationPage = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const router = useRouter();
  const params = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [verificationResponse, setVerificationResponse] =
    useState<VerifyInvitationResponse | null>(null);

  useEffect(() => {
    getAuthenticatedUser().then((res) => {
      if (res) {
        router.replace("/");
      }
    });

    const invitation = params.get("c");

    if (!invitation) {
      message.error(t("invalidInvitation.data"));
      router.push("/auth/sign-in");
    } else {
      verifyInvitationAction({ invitation }).then((response) => {
        setLoading(false);
        if (response.isSuccess) {
          setVerificationResponse(response.result || null);
        } else {
          message.error(response.messages);
          router.push("/auth/sign-in");
        }
      });
    }
  }, [message, params, router, t]);

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center h-64">
        <LoadingIcon icon="rings" color="rgb(var(--color-theme-2))" />
        <p className="ml-2 font-semibold text-theme-1">
          {t("invitation.verifying")}
        </p>
      </div>
    );
  }

  if (verificationResponse) {
    return (
      <div className="h-full flex justify-center items-center">
        <CompleteInvitationForm verification={verificationResponse} />
      </div>
    );
  }
};

export default InvitationPage;
