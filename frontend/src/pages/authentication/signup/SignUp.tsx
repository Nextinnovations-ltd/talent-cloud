import { SignUpForm } from "@/components/authentication/signup/SignUpForm";
import { AuthFormFrame } from "@/components/common/form/AuthFormFrame";
import routesMap from "@/constants/routesMap";
import { useApiCaller } from "@/hooks/useApicaller";
import { SignUpSchema } from "@/lib/inputYupSchema";
import { useSignUpMutation } from "@/services/slices/authSlice";
import SignUpApiError from "@/types/auth-types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  // const [signUp, { isLoading }] = useSignUpMutation();
  const navigate = useNavigate();
  const { executeApiCall, isLoading } = useApiCaller(useSignUpMutation);

  const form = useForm({
    resolver: yupResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmitHandler = async (credentials: any) => {
    try {
      const res = await executeApiCall(credentials);
      console.log(res);
      if (res.success) {
        navigate(`/auth/${routesMap.verifyEmail.path}`);
      }
    } catch (error) {
      const typedError = error as SignUpApiError;

      if (typedError?.data?.data?.email?.[0]) {
        form.setError("email", {
          type: "custom",
          message: typedError.data.data.email[0],
        });
      }
    }
  };

  return (
    <AuthFormFrame
      type="login"
      form={
        <SignUpForm
          isLoading={isLoading}
          onSubmitHandler={onSubmitHandler}
          form={form}
        />
      }
    />
  );
};
