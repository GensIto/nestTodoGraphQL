import { useNavigate } from "react-router-dom";

type AuthInput = { email: string; password: string };

export const handleAuth = async (
  event: React.FormEvent<HTMLFormElement>,
  authInput: AuthInput,
  authFunction: (input: any) => Promise<any>
) => {
  event.preventDefault();
  const navigate = useNavigate();

  try {
    const result = await authFunction({
      variables: { signInInput: authInput },
    });
    if (result.data) {
      localStorage.setItem("token", result.data.signIn.accessToken);
      navigate("/");
    }
  } catch (error: any) {
    console.log(error.message);
    const errorMessage =
      error.message === "Unauthorized"
        ? "認証エラーが発生しました"
        : "予期せぬエラーが発生しました";
    alert(errorMessage);
  }
};
