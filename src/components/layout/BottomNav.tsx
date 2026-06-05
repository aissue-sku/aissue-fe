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

const NAV_SOURCE_KEY = 'navSource';

const resolveActiveTab = (pathname: string): string | null => {
  if (pathname === '/notification' || pathname.startsWith('/home')) return '/home';
  if (pathname.startsWith('/search')) return '/search';
  if (pathname.startsWith('/profile')) return '/profile';
  if (pathname.startsWith('/analysis')) {
    if (typeof window !== 'undefined' && sessionStorage.getItem(NAV_SOURCE_KEY) === '/home') {
      return '/home';
    }
    return '/analysis';
  }
  return null;
};

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activePath = resolveActiveTab(pathname);

  const handleTabClick = (path: string) => {
    sessionStorage.setItem(NAV_SOURCE_KEY, path);
    navigate(path);
  };

  return (
    <nav className="h-16 bg-white flex items-center justify-center gap-14 px-6 flex-shrink-0 rounded-tl-[30px] rounded-tr-[30px] shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      {tabs.map(({ path, icon, activeIcon }) => {
        const active = activePath === path;
        return (
          <button
            key={path}
            onClick={() => handleTabClick(path)}
            className="flex items-center justify-center w-12 h-12 cursor-pointer"
          >
            <img
              src={active ? activeIcon : icon}
              alt={path}
              className="w-8 h-8"
              style={active ? { filter: 'var(--color-primary-filter)' } : undefined}
            />
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
