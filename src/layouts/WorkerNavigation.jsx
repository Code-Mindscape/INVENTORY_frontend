import { Outlet } from "react-router-dom";
import { WorkerNavBar } from "../components";

const WorkerNavigation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <WorkerNavBar />
      <main className="p-4 flex-1 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkerNavigation;
