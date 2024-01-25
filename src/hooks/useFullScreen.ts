import { useNavigate, useLocation } from 'react-router-dom';

const TABLET_WIDTH = 768;

export const useFullScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const isFullScreen =
    window.innerWidth < TABLET_WIDTH && searchParams.get('fullscreen') === 'true';

  const toggleFullScreen = () => {
    searchParams.set('fullscreen', isFullScreen ? 'false' : 'true');
    navigate({
      pathname: location.pathname,
      search: `?${searchParams.toString()}`,
    });
  };

  return {
    isFullScreen,
    toggleFullScreen,
  };
};
