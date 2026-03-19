import { Link, NavLink } from 'react-router';
import './header.css';

type HeaderProps = {
  cart: {
    productId: string;
    quantity: number;
    deliveryOptionId: string;
  }[];
  currentUser?: {
    name: string;
    role: string;
  } | null;
  favoritesCount?: number;
  onSignOut?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  theme?: string;
  onThemeToggle?: () => void;
};

export function Header({
  cart,
  currentUser,
  favoritesCount = 0,
  onSignOut,
  searchTerm = '',
  onSearchChange,
  theme = 'dark',
  onThemeToggle
}: HeaderProps) {
  const totalQuantity = cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

  return (
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link brand-link">
          <img className="logo" src="images/logo-white.svg" />
          <img className="mobile-logo" src="images/mobile-logo-white.svg" />
        </Link>
      </div>

      <div className="middle-section">
        <div className="search-shell">
          <input
            className="search-bar"
            type="text"
            placeholder="Search products, orders, or styles"
            value={searchTerm}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
          <button className="search-button" type="button" aria-label="Search products">
            <img className="search-icon" src="images/icons/search-icon.png" />
          </button>
        </div>
      </div>

      <div className="right-section">
        {currentUser ? (
          <div className="user-chip">
            <span>{currentUser.name}</span>
            <small>{currentUser.role}</small>
          </div>
        ) : null}

        <button className="theme-toggle" type="button" onClick={onThemeToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </button>

        {currentUser?.role === 'Admin' ? (
          <NavLink className="admin-link header-link" to="/admin/products">
            <span className="orders-text">Manage products</span>
          </NavLink>
        ) : null}

        <NavLink className="orders-link header-link" to="/orders">
          <span className="orders-text">Orders</span>
        </NavLink>

        <NavLink className="favorites-link header-link" to="/favorites">
          <span className="orders-text">Favorites</span>
          <strong>{favoritesCount}</strong>
        </NavLink>

        <NavLink className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src="images/icons/cart-icon.png" />
          <div className="cart-quantity-badge">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </NavLink>

        <button className="header-link signout-button" type="button" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
