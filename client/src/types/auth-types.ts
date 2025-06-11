interface SignUpApiError {
  data?: {
    data?: {
      username?: string[];
      email?: string[];
    };
  };
}

export default SignUpApiError;
