import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({mode})=>{

  let apiBaseUrl;
  let wsBaseUrl;

  let googleCallBackUrl;
  let linkedInCallBackUrl;
  let facebookCallBackUrl;

  if (mode === "staging"){
    apiBaseUrl = "http://staging.talent-cloud.asia/api/v1/";
    wsBaseUrl = "ws://staging.talent-cloud.asia/ws/notifications/"

    googleCallBackUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id=394068996425-9uu48cj29id232k3di793gvdbb4a50fa.apps.googleusercontent.com&redirect_uri=http://staging.talent-cloud.asia/api/v1/auth/accounts/google&response_type=code&scope=email profile";
    linkedInCallBackUrl = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=866khyw28sevz8&redirect_uri=http://staging.talent-cloud.asia/api/v1/auth/accounts/linkedin&state=foobar&scope=openid email profile";
    facebookCallBackUrl = "https://www.facebook.com/v22.0/dialog/oauth?client_id=1999611343882551&redirect_uri=http://staging.talent-cloud.asia/api/v1/auth/accounts/facebook&scope=email&state={st=state123abc,ds=123456789}"
  }else {
    apiBaseUrl = "http://localhost:8000/api/v1/";
    wsBaseUrl = "ws://localhost:8000/ws/notifications/"

    googleCallBackUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id=394068996425-9uu48cj29id232k3di793gvdbb4a50fa.apps.googleusercontent.com&redirect_uri=http://localhost:8000/api/v1/auth/accounts/google&response_type=code&scope=email profile";
    linkedInCallBackUrl = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=866khyw28sevz8&redirect_uri=http://localhost:8000/api/v1/auth/accounts/linkedin&state=foobar&scope=openid email profile";
    facebookCallBackUrl = "https://www.facebook.com/v22.0/dialog/oauth?client_id=1999611343882551&redirect_uri=http://staging.talent-cloud.asia/api/v1/auth/accounts/facebook&scope=email&state={st=state123abc,ds=123456789}"
  }



   return {
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      server: {
        host: '0.0.0.0',       // Allows access from LAN
        port: 5173,            // You can choose a different port if needed
        strictPort: true,      // Prevents fallback to a different port
      },
      preview: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
    },
    define:{
      __API_BASE_URL__: JSON.stringify(apiBaseUrl),
      __WS_BASE_NOTIFICATION_URL__: JSON.stringify(wsBaseUrl),
      __GOOGLLE_CALL_BACK_URL_ : JSON.stringify(googleCallBackUrl),
      __LINKEDIN_CALL_BACK_URL_ : JSON.stringify(linkedInCallBackUrl),
      __FACEBOOK_CALLL_BACK_URL_ : JSON.stringify(facebookCallBackUrl)
    }
   }
});
