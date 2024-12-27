import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Home, User, UserPlus, LogIn } from "lucide-react";
import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const MainNav = () => {
  const [session, setSession] = useState(null);

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
          <NavigationMenuItem>
            <Link to="/mypage" className={navigationMenuTriggerStyle()}>
              <User className="mr-2 h-4 w-4" />
              マイページ
            </Link>
          </NavigationMenuItem>
        ) : (
          <>
            <NavigationMenuItem>
              <Link to="/login" className={navigationMenuTriggerStyle()}>
                <LogIn className="mr-2 h-4 w-4" />
                ログイン
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/login" className={navigationMenuTriggerStyle()}>
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