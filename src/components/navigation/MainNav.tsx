import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, UserPlus, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const MainNav = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // サブスクリプション情報を取得
  const { data: subscription } = useQuery({
    queryKey: ['subscription', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast({
        title: "ログアウトしました",
        description: "ご利用ありがとうございました",
      });
    } catch (error) {
      toast({
        title: "エラーが発生しました",
        description: "ログアウトに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <NavigationMenu className="max-w-none w-full justify-between px-6 py-3 border-b">
      <NavigationMenuList className="gap-6">
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            <Home className="mr-2 h-4 w-4" />
            トップページ
          </Link>
        </NavigationMenuItem>
        {session ? (
          <>
            <NavigationMenuItem>
              <Link to="/mypage" className={navigationMenuTriggerStyle()}>
                <User className="mr-2 h-4 w-4" />
                マイページ
                {subscription?.plan === 'premium' && (
                  <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <button
                onClick={handleLogout}
                className={navigationMenuTriggerStyle()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                ログアウト
              </button>
            </NavigationMenuItem>
          </>
        ) : (
          <>
            <NavigationMenuItem>
              <Link to="/login" className={navigationMenuTriggerStyle()}>
                <LogIn className="mr-2 h-4 w-4" />
                ログイン
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/signup" className={navigationMenuTriggerStyle()}>
                <UserPlus className="mr-2 h-4 w-4" />
                会員登録
              </Link>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};