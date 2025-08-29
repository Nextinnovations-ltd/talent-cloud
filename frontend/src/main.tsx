import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router.tsx";
// @ts-expect-error: Fontsource types are not available for this import
import "@fontsource/poppins";
import "@/i18n";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "./services/api/apiSlice";
import authReducer from "./services/slices/authSlice";
import adminAuthReducer from "./services/slices/adminAuthSlice";
import { ERRORCIRCLE, TickCircle } from "./constants/svgs";
import { Toaster } from "@/components/ui/sonner"


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    adminAuth: adminAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

createRoot(document.getElementById("root")!).render(
 <>
  <Provider store={store}>
    <Toaster icons={{
      success:<TickCircle/>,
      error:<ERRORCIRCLE/>,
      warning:<TickCircle/>
    }} />
    
    <RouterProvider router={router} />
   
  </Provider>

 </>
);


