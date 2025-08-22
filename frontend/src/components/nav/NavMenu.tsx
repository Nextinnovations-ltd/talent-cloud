import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useLocation } from "react-router-dom";
import routesMap from "@/constants/routesMap";

export function NavigationMenuDemo() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                isActive("/") && " text-blue-500"
              )}
            >
              Find Jobs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to={`/user/${routesMap?.appliedJobs.path}`}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                isActive(`/user/${routesMap?.appliedJobs.path}`) &&
                  "text-blue-500"
              )}
            >
              Applied Jobs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link to={`/user/${routesMap?.savedJobs.path}`}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                isActive(`/user/${routesMap?.savedJobs.path}`) &&
                  "text-blue-500"
              )}
            >
              Saved Jobs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
