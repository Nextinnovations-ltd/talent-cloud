export interface AuthState {
    token?: string;
    isAuthenticated: boolean;
    email?: string;
  }
  

  export interface AuthActions {
    setToken: (token: string) => void; 
    setAuthenticate: (value: boolean) => void;
    setEmail: (email: string) => void; 
  }
  