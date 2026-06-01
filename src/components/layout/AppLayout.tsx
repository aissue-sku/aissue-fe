import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const AppLayout = () => {
  return (
    <div className="h-dvh flex flex-col bg-white">
      <main className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </main>
      <div id="bottom-action-bar" />
      <BottomNav />
    </div>
  );
};

export default AppLayout;
