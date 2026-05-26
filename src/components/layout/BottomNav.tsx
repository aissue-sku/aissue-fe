import { useLocation, useNavigate } from 'react-router-dom';
import homeIcon from '../../assets/home.svg';
import homeBlueIcon from '../../assets/home-blue.svg';
import searchIcon from '../../assets/search.svg';
import searchBlueIcon from '../../assets/search-blue.svg';
import graphIcon from '../../assets/graph.svg';
import graphBlueIcon from '../../assets/graph-blue.svg';
import profileIcon from '../../assets/profile.svg';
import profileBlueIcon from '../../assets/profile-blue.svg';

const tabs = [
  { path: '/home', icon: homeIcon, activeIcon: homeBlueIcon },
  { path: '/search', icon: searchIcon, activeIcon: searchBlueIcon },
  { path: '/analysis', icon: graphIcon, activeIcon: graphBlueIcon },
  { path: '/profile', icon: profileIcon, activeIcon: profileBlueIcon },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="h-16 bg-white flex items-center justify-center gap-14 px-6 flex-shrink-0 rounded-tl-[30px] rounded-tr-[30px] shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      {tabs.map(({ path, icon, activeIcon }) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex items-center justify-center w-12 h-12 cursor-pointer"
          >
            <img src={active ? activeIcon : icon} alt={path} className="w-8 h-8" />
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
