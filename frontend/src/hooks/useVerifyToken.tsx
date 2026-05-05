import { getTokenFromLocalStorage, getTokenFromSessionStorage, removeTokenFromSessionStorage } from "@/helpers/operateBrowserStorage";
import {
  getIsGeneratedUsername,
  selectToken,
  useVerifyTokenMutation,
} from "@/services/slices/authSlice";
import { useEffect, useState } from "react";
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

  const isGeneratedUsername = useSelector(getIsGeneratedUsername) as boolean;
  const [verifyToken, { isLoading, isSuccess }] = useVerifyTokenMutation();
  const [hasToken, setHasToken] = useState(Boolean(token));

  // Update hasToken when token changes (e.g. across tabs)
  useEffect(() => {
    const handleStorageChange = (e?: StorageEvent) => {
      // If another tab triggered a logout event, clear our own session storage
      if (e && e.key === "logoutEvent") {
        removeTokenFromSessionStorage();
      }

      const currentToken = getTokenFromLocalStorage() || getTokenFromSessionStorage();
      const newTokenState = Boolean(currentToken);
      
      // Only update state if it actually changed to avoid unnecessary re-renders
      setHasToken((prev) => {
        if (prev !== newTokenState) {
          return newTokenState;
        }
        return prev;
      });
    };

    // Listen for storage events from other tabs
    window.addEventListener("storage", handleStorageChange);
    
    // Also set up an interval to check for changes in the current tab
    // (since storage events don't fire in the tab that made the change)
    const intervalId = setInterval(() => handleStorageChange(), 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    setHasToken(Boolean(token));
  }, [token]);

  useEffect(() => {
    if (token && !shouldSkip) {
      verifyToken({ token });
    }
  }, [token, verifyToken, shouldSkip]);

  return {
    hasToken,
    isGeneratedUsername,
    isTokenVerifying: isLoading,
    isSucceedTokenVerifying: isSuccess,
  };
}
