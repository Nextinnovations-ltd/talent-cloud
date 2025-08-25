import { Logo } from "../common/Logo";
import { NavigationMenuDemo } from "./NavMenu";
import { SearchBar } from "./SearchBar";
import { useState, useRef, useEffect } from "react";
import useJobSearchStore from "@/state/zustand/job-search";
import { useLocation } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import NotificationDropDown from "../notifications/notificationDropDown";

export const NavBar = () => {
  const { searchQuery, setSearchQuery } = useJobSearchStore();
  const [input, setInput] = useState(searchQuery);
  const location = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Clear search when navigating away from home page
  useEffect(() => {
    if (location.pathname !== "/") {
      setSearchQuery("");
      setInput("");
    }
  }, [location.pathname, setSearchQuery]);

  // Update local input state when searchQuery changes
  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (location.pathname === "/") {
      setSearchQuery(input);
    }
    setSearchFocused(false); // Remove blur overlay after search
    if (searchInputRef.current) {
      searchInputRef.current.blur(); // Remove focus from input
    }
  };

  const handleBlurOverlay = () => {
    setSearchFocused(false);
    // Remove focus from input
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  return (
    <>
      {searchFocused && (
        <div
          className="fixed inset-0 z-[900] bg-black/10 backdrop-blur-[1px] transition-all duration-300 animate-fade-in"
          onClick={handleBlurOverlay}
        />
      )}
      <div className="h-[100px] bg-white  z-[900] fixed top-0  w-full right-0 px-[40px] ">
        <div className="flex items-center duration-500 justify-evenly  gap-[30px] h-full ">
          <Logo />
          <form  onSubmit={handleSearch}>
            {location.pathname === "/" ? (
              <SearchBar
                value={input}
                setValue={setInput}
                width="md"
                onSearch={handleSearch}
                isFocused={searchFocused}
                setIsFocused={setSearchFocused}
                inputRef={searchInputRef}
              />
            ) : (
              // Placeholder to maintain layout when search bar is hidden
              <div style={{ width: 354, height: 40 }} />
            )}
          </form>
          <NavigationMenuDemo />
          <div className="flex -2  gap-[30px]  items-center justify-center">
            <NotificationDropDown/>
           <UserProfile/>
          </div>
        </div>
      </div>
    </>
  );
};
