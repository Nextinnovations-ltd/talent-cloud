import { LoginForm } from "@/components/authentication/login/LoginForm";
import { AuthFormFrame } from "@/components/common/form/AuthFormFrame";
import { useApiCaller } from "@/hooks/useApicaller";
import { setKeepLoggedIn, useLoginMutation } from "@/services/slices/authSlice";
import { useDispatch } from "react-redux";

export const Login = () => {
  const dispatch = useDispatch();
  const { executeApiCall, isLoading } = useApiCaller(useLoginMutation);

  const onSubmitHandler = async (data: any) => {
    try {
      if (data?.rememberMe) {
        dispatch(setKeepLoggedIn({ value: data?.rememberMe }));
      }

      const payload = {
        email: data.email,
        password: data.password,
      };

      const res = await executeApiCall(payload);

      if (res.success) {
        if (res.data.data.is_generated_username) {
          //window.location.href = "/verify";
          window.location.href = "/";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AuthFormFrame
      type="signup"
      form={
        <LoginForm isLoading={isLoading} onSubmitHandler={onSubmitHandler} />
      }
    />
  );
};
