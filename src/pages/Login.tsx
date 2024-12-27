import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainNav } from "@/components/navigation/MainNav";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ログイン状態をチェックし、ログイン済みの場合はメインページにリダイレクト
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div>
      <MainNav />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              アカウントにログイン
            </h2>
          </div>
          <div className="mt-8">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              theme="light"
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: "メールアドレス",
                    password_label: "パスワード",
                    button_label: "ログイン",
                  },
                  sign_up: {
                    email_label: "メールアドレス",
                    password_label: "パスワード",
                    button_label: "アカウント作成",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;