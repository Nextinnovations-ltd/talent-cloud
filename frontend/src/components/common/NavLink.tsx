import { Link } from "react-router-dom";
import React from "react";

export const NavLink: React.FC<NavLinkType> = ({ title, to }) => {
  return (
    <Link
      to={to}
      className="text-sm text-text-lightblue hover:underline hover:text-text-hoverskyblue transition duration-100"
    >
      {title}
    </Link>
  );
};
