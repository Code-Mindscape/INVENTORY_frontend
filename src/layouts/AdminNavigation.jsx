import { Outlet } from "react-router-dom";
import { NavBar } from "../components";

const AdminNavigation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminNavigation;
