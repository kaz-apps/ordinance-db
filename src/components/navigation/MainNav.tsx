import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { Home, User } from "lucide-react";

export const MainNav = () => {
  return (
    <NavigationMenu className="max-w-none w-full justify-start px-6 py-3 border-b">
      <NavigationMenuList className="gap-6">
        <NavigationMenuItem>
          <Link to="/" className={navigationMenuTriggerStyle()}>
            <Home className="mr-2 h-4 w-4" />
            トップページ
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/mypage" className={navigationMenuTriggerStyle()}>
            <User className="mr-2 h-4 w-4" />
            マイページ
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};