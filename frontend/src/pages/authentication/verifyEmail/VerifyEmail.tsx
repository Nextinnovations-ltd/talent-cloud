/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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

// Constants
const RESEND_COOLDOWN = 120; // 2 minutes in seconds
const STORAGE_KEYS = {
  RESEND_TIMESTAMP: 'verifyEmailResendTimestamp'
};

export const VerifyEmail = () => {
  const { t } = useTranslation("verifyEmail");
  const [end, setEnd] = useState(false);
  const [, setTimeRemaining] = useState(RESEND_COOLDOWN);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  // Timer function
  const startTimer = (initialTime: number) => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimeRemaining(initialTime);
    setEnd(initialTime <= 0);
    
    if (initialTime > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => {
          const newTime = prevTime - 1;
          
          if (newTime <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            setEnd(true);
            localStorage.removeItem(STORAGE_KEYS.RESEND_TIMESTAMP);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
  };

  // Load saved timer state from localStorage on component mount
  useEffect(() => {
    const savedResendTimestamp = localStorage.getItem(STORAGE_KEYS.RESEND_TIMESTAMP);
    
    if (savedResendTimestamp) {
      const timestamp = parseInt(savedResendTimestamp);
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsed = currentTime - timestamp;
      const newRemaining = Math.max(0, RESEND_COOLDOWN - elapsed);
      
      startTimer(newRemaining);
    } else {
      // If no timestamp in storage, start with full cooldown
      const currentTimestamp = Math.floor(Date.now() / 1000);
      localStorage.setItem(STORAGE_KEYS.RESEND_TIMESTAMP, currentTimestamp.toString());
      startTimer(RESEND_COOLDOWN);
    }
    
    setIsInitialLoad(false);
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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
      
      // Save the timestamp to localStorage
      const currentTimestamp = Math.floor(Date.now() / 1000);
      localStorage.setItem(STORAGE_KEYS.RESEND_TIMESTAMP, currentTimestamp.toString());
      
      // Start the timer
      startTimer(RESEND_COOLDOWN);
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
        // Clear the timer storage on successful verification
        localStorage.removeItem(STORAGE_KEYS.RESEND_TIMESTAMP);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        
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

  // Don't show anything until initial load is complete
  if (isInitialLoad) {
    return (
      <div className="md:mx-0 h-[100svh] flex items-center justify-center bg-slate-100">
        <Card className="md:w-[506px] w-[90%]">
          <CardContent className="text-center p-8">
            <div className="animate-pulse">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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


                <button type="button"   onClick={handleResendToken}>
                  <h3
                    title="Resend code"
                   
                    className="text-sm text-text-lightblue cursor-pointer"
                  >
                    Resend code
                  </h3>
                </button>
              {/* ) : (
                <h3 className="text-[#686C73] flex items-center justify-end">
                  Resent code in:&nbsp;
                  <div className="w-[40px] text-center">
                    {timeRemaining}
                  </div>
                  &nbsp;sec
                </h3>
              )} */}

              <PrimaryButton
                title="Verify"
                loading={registerLoading}
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