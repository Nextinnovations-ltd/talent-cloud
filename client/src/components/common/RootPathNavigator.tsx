import routesMap from "@/constants/routesMap";
import { Navigate } from "react-router-dom";

export default function RootPathNavigator() {
  const userRole = "Member";

  const { dashboard, home } = routesMap;

  const path = userRole === "Member" ? `${dashboard.path}` : `${home?.name}`;

  return <Navigate to={path} />;
}
