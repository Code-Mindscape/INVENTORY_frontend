import { Outlet } from "react-router-dom";

const NavigationLayout = () => (
  <div className="min-h-screen flex flex-col items-center justify-center">
    <main className="w-full h-full flex-1">
      <Outlet />
    </main>
  </div>
);

export default NavigationLayout;
