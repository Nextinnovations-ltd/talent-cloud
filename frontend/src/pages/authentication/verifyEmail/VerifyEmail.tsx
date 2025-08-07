import { NavLink } from "@/components/common/NavLink";
import { OTP } from "@/components/common/OTP";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  useReactiavateTokenMutation,
  useRegisterActivationMutation,
  useTokenVerifyMutation,
} from "@/services/slices/authSlice";
import useToast from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OTPSchema } from "@/lib/inputYupSchema";
import { FormControl, FormField, FormItem, Form } from "@/components/ui/form";
import * as yup from "yup";
import routesMap from "@/constants/routesMap";
import { useApiCaller } from "@/hooks/useApicaller";

type OTPFormValues = yup.InferType<typeof OTPSchema>;

export const VerifyEmail = () => {
  const { t } = useTranslation("verifyEmail");
  const [end, setEnd] = useState(false);
  const countRef = useRef<any>(null);

  const { executeApiCall, isLoading: resendLoading } = useApiCaller(
    useReactiavateTokenMutation
  );
  const [verify, { isLoading: verifyLoading }] = useTokenVerifyMutation();
  const [register, { isLoading: registerLoading }] = useRegisterActivationMutation();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { showNotification } = useToast();
  const navigate = useNavigate();

  const form = useForm<OTPFormValues>({
    resolver: yupResolver(OTPSchema),
  });

  const formDisabled = resendLoading || registerLoading || verifyLoading;

  useEffect(() => {
    const verifyToken = async (token: string | null) => {
      if (!token) return;
      try {
        await verify({ token, action: "registration" }).unwrap();
      } catch (error: any) {
        showNotification({
          message: error?.data.message,
          type: "danger",
        });
        setEnd(true);
      }
    };
    verifyToken(token);
  }, [token, verify]);

  const handleResendToken = async () => {
    if (!token) return;
    try {
      await executeApiCall({ token });
      setEnd(false);
      countRef.current?.start(); // Restart timer
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmitForm = async (value: OTPFormValues) => {
    if (!token) return;
    try {
      const res: any = await register({
        token: token,
        verification_code: value.verification_code,
      }).unwrap();

      if (res?.status) {
        showNotification({ message: res?.message, type: "success" });
        navigate(`/auth/${routesMap.login.path}`);
      }
    } catch (error: any) {
      showNotification({
        message: error?.data?.message || "An error occurred during verification.",
        type: "danger",
      });
    }
  };

  return (
    <div className="md:mx-0 h-[100svh] flex items-center justify-center bg-slate-100">
      <Card className="md:w-[506px] w-[90%]">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <h3 className="font-extrabold">{t("title")}</h3>
          </CardTitle>
          <CardDescription>
            {end ? "Token is expired please resend the code" : t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-right">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmitForm)}
              className="space-y-4 my-4"
            >
              <FormField
                control={form.control}
                name="verification_code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <OTP field={field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {end ? (
                <div>
                  <h3
                    title="Resend code"
                    onClick={handleResendToken}
                    className="text-sm text-text-lightblue cursor-pointer"
                  >
                    Resend code
                  </h3>
                </div>
              ) : (
                <h3 className="text-[#686C73] flex items-center justify-end">
                  Resent code in:&nbsp;
                  <div className="w-[25px] text-center">
                    <CountUp
                      ref={countRef}
                      onEnd={() => setEnd(true)}
                      end={60}
                      start={0}
                      duration={60}
                      useEasing={false}
                    />
                  </div>
                  &nbsp;sec
                </h3>
              )}

              <PrimaryButton
                title="Verify"
                type="submit"
                loading={formDisabled}
                isButtonDisabled={formDisabled}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flexBox.center flex items-center justify-center">
          <NavLink to="/auth/login" title="Back to Login" />
        </CardFooter>
      </Card>
    </div>
  );
};
