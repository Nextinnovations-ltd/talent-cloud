import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

export const OTP = ({ field }: { field: any }) => {
  return (
    <InputOTP maxLength={6} {...field}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
};
