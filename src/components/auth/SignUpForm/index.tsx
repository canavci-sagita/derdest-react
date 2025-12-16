"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { App, Tooltip } from "antd";
import { useTranslation } from "@/stores/TranslationContext";
import { useActionForm } from "@/lib/hooks/useActionForm";
import { SignUpRequest, signUpSchema } from "@/services/auth/auth.types";
import { createFormState } from "@/lib/utils/form.utils";
import { AddEditPhoneNoDto } from "@/services/common/AddEditPhoneNoDto";
import { useRouter } from "next/navigation";
import Button from "@/components/common/ui/Button";
import Step2_ChoosePlan from "./Step2_ChoosePlan";
import Step1_AccountInformation from "./Step1_AccountInformation";
import { useCountries } from "@/lib/hooks/tanstack/useCountries";
import { StripeProductDto } from "@/services/products/products.types";
import { getAllSubscriptionPlansAction } from "@/actions/products.actions";
import { signUpAction } from "@/actions/auth.actions";

const emptySignUpRequest: SignUpRequest = {
  isCompany: false,
  productId: null,
  nationalId: null,
  taxId: null,
  companyEmail: null,
  companyTitle: null,
  phoneNo: null,
  countryId: 0,
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
};

const initialState = createFormState<SignUpRequest>();

const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();

  const formRef = useRef<HTMLFormElement>(null);
  const { data: countries = [] } = useCountries();

  const [serverState, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  const { displayState, setDisplayState, clearFieldError, clearFormMessage } =
    useActionForm(serverState, initialState);

  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<SignUpRequest>(emptySignUpRequest);
  const [singleUserPlans, setSingleUserPlans] = useState<StripeProductDto[]>(
    []
  );
  const [lawFirmPlans, setLawFirmPlans] = useState<StripeProductDto[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = signUpSchema(t)?.safeParse(data);

    if (!validation.success) {
      const errors = validation.error.format();

      setDisplayState({
        status: "error",
        errors: errors,
        fields: data,
      });
      return;
    }

    startTransition(() => formAction(validation.data));
  };

  const handleNext = () => {
    //NOTE: To prevent auto-fill validation failure.
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const email = formData.get("email");
      const password = formData.get("password");
      if (email) {
        data.email = email.toString();
      }
      if (password) {
        data.password = password.toString();
      }
    }

    const validation = signUpSchema(t)?.safeParse(data);

    if (!validation.success) {
      setDisplayState({
        status: "error",
        errors: validation.error.format(),
        fields: data,
      });
      return;
    }

    setCurrentStep(2);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleDataChange = (
    key: keyof SignUpRequest,
    value: string | number | boolean | AddEditPhoneNoDto | null
  ) => {
    setData((prev) => {
      const newData = { ...prev, [key]: value };
      if (key === "isCompany") {
        newData.productId = null;
        newData.companyTitle = null;
        newData.taxId = null;
      } else {
        newData.nationalId = null;
      }

      return newData;
    });
    clearFieldError(key as string);
  };

  useEffect(() => {
    getAllSubscriptionPlansAction().then((res) => {
      if (res.isSuccess) {
        const allPlans = res.result || [];
        const singlePlans = allPlans.filter((p) =>
          p.lookupKey.startsWith("single")
        );
        const multiPlans = allPlans.filter(
          (p) => !p.lookupKey.startsWith("single")
        );

        setSingleUserPlans(singlePlans);
        setLawFirmPlans(multiPlans);
      } else {
        message.error(res.messages);
      }
    });
  }, [data.isCompany, message]);

  useEffect(() => {
    if (displayState.status === "success") {
      message.success(displayState.message);

      if (displayState.result) {
        const encryptedToken = displayState.result as string;

        const params = new URLSearchParams();
        params.set("token", encryptedToken);
        router.push(`/auth/verify?${params.toString()}`);
      } else {
        router.push("/auth/sign-in");
      }
    } else if (displayState.status === "error" && displayState.message) {
      if (Array.isArray(displayState.message)) {
        message.error(
          displayState.message.map((m, i) => (
            <p className="text-left" key={i}>
              {m}
            </p>
          ))
        );
      } else {
        message.error(displayState.message);
      }
      clearFormMessage();
    }
  }, [displayState, displayState.message, message, router, clearFormMessage]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      <nav className="flex items-center justify-between text-sm font-medium text-slate-500 my-8 border-b">
        <div
          className={`p-2 ${
            currentStep === 1
              ? "text-primary font-semibold border-b-2 border-primary"
              : "text-slate-400"
          }`}
        >
          1. {t("accountInformation")}
        </div>
        <div
          className={`p-2 ${
            currentStep === 2
              ? "text-primary font-semibold border-b-2 border-primary"
              : "text-slate-400"
          }`}
        >
          2. {t("chooseSubscription")}
        </div>
      </nav>
      <div className={currentStep === 1 ? "block" : "hidden"}>
        <Step1_AccountInformation
          data={data}
          errors={displayState.errors}
          onChange={handleDataChange}
          clearFieldError={clearFieldError as (name: string) => void}
          countries={countries}
        />
      </div>
      <div className={currentStep === 2 ? "block" : "hidden"}>
        <Step2_ChoosePlan
          value={data}
          products={data.isCompany ? lawFirmPlans : singleUserPlans}
          onChange={handleDataChange}
        />
      </div>
      <div className="mt-8">
        {currentStep === 1 && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              localizedLabel="next"
              iconDirection="right"
              icon="CircleArrowRight"
              onClick={handleNext}
            />
          </div>
        )}
        {currentStep === 2 && (
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline-primary"
              localizedLabel="back"
              iconDirection="left"
              icon="CircleArrowLeft"
              disabled={isPending}
              onClick={handleBack}
            />
            <Tooltip
              color="red"
              title={!data.productId ? t("selectPlanToContinue") : null}
            >
              <Button
                type="submit"
                variant="primary"
                rounded="lg"
                iconDirection="left"
                icon="Scale"
                loading={isPending}
                disabled={!data.productId || isPending}
                localizedLabel={isPending ? "loading" : "createAccount"}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </form>
  );
};

export default SignUpForm;
