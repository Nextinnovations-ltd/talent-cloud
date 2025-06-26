import { MessageIcon } from "@/constants/svgs";
import { Logo } from "../common/Logo";
import { NavigationMenuDemo } from "./NavMenu";
import { SearchBar } from "./SearchBar";
import { BellIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AvatarProfile } from "../common/Avatar";
import { Link } from "react-router-dom";
import { useState } from "react";
import routesMap from "@/constants/routesMap";

export const NavBar = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="h-[100px] bg-white  z-[1000] fixed top-0  w-full right-0 px-[40px] ">
      <div className="flex items-center justify-evenly  gap-[30px] h-full ">
        <Logo />
        <SearchBar value={search} setValue={setSearch} width="md" />
        <NavigationMenuDemo />
        <div className="flex gap-[30px]  items-center justify-center">
          <MessageIcon />
          <Link to={`organization/detail/1`}>
          <BellIcon />
          </Link>
         
          <Button
            className="w-[132px] h-[50px] rounded-[33px]"
            variant={"outline"}
          >
            Write Blogs
          </Button>
          <Link to={`user/${routesMap?.mainProfile?.path}`}>
            <AvatarProfile status={true} />
          </Link>
        </div>
      </div>
    </div>
  );
};
