import { useDispatch } from 'react-redux';
import { toggleWishlist } from '../store';

// Dispatches a custom event that Header listens to and opens LoginModal
function requestLogin() {
  window.dispatchEvent(new CustomEvent('jordan:openLogin'));
}

function isLoggedIn() {
  try {
    const stored = localStorage.getItem('jordan_user');
    const parsed = stored ? JSON.parse(stored) : null;
    return parsed?.loggedIn === true;
  } catch {
    return false;
  }
}

export function useWishlist() {
  const dispatch = useDispatch();

  const handleWishlist = (id, e) => {
    if (e) e.stopPropagation();
    if (!isLoggedIn()) {
      requestLogin();
      return;
    }
    dispatch(toggleWishlist(id));
  };

  return handleWishlist;
}