import { getTokenFromLocalStorage, getTokenFromSessionStorage } from "@/helpers/operateBrowserStorage";
import {
  getIsGeneratedUsername,
  selectToken,
  useVerifyTokenMutation,
} from "@/services/slices/authSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

type UseTokenVerifyReturn = {
  hasToken: boolean;
  isGeneratedUsername: boolean;
  isTokenVerifying: boolean;
  isSucceedTokenVerifying: boolean;
};

export default function useTokenVerify(
  shouldSkip?: boolean
): UseTokenVerifyReturn {
  const token = useSelector(selectToken) || getTokenFromLocalStorage() || getTokenFromSessionStorage();

  console.log({token})

  const isGeneratedUsername = useSelector(getIsGeneratedUsername) as boolean;
  const [verifyToken, { isLoading, isSuccess }] = useVerifyTokenMutation();


  useEffect(() => {
    if (token && !shouldSkip) {
      verifyToken({ token });
    }
  }, [token, verifyToken, shouldSkip]);

  return {
    hasToken: Boolean(token),
    isGeneratedUsername,
    isTokenVerifying: isLoading,
    isSucceedTokenVerifying: isSuccess,
  };
}
