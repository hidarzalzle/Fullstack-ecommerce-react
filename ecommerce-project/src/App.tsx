import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { HomePage } from './pages/home/HomePage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { LoginPage } from './pages/login/LoginPage';
import { FavoritesPage } from './pages/favorites/FavoritesPage';
import { TrackingPage } from './pages/tracking/TrackingPage';
import { ProductManagementPage } from './pages/home/ProductManagementPage';
import { authStorageKey, themeStorageKey } from './data/auth';
import { loadFavorites, toggleFavorite } from './utils/favorites';
import './App.css';

const trackingStorageKey = 'northstar-tracking-overrides';

type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
  product?: { id: string };
};

type Product = {
  id: string;
  name: string;
  image: string;
  priceCents: number;
  keywords?: string[];
};

type Order = {
  id: string;
  orderTimeMs: number;
  totalCostCents: number;
  products: Array<{
    productId: string;
    quantity: number;
    estimatedDeliveryTimeMs: number;
    product?: Product;
  }>;
};

type DemoUser = {
  role: string;
  name: string;
  email: string;
  password: string;
};

type HeaderProps = {
  cart: CartItem[];
  currentUser: DemoUser | null;
  favoritesCount: number;
  onSignOut: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  theme: string;
  onThemeToggle: () => void;
};

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem(themeStorageKey) ?? 'dark');
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(() => {
    const storedUser = localStorage.getItem(authStorageKey);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [trackingOverrides, setTrackingOverrides] = useState<Record<string, number>>(() => {
    const storedOverrides = localStorage.getItem(trackingStorageKey);
    return storedOverrides ? JSON.parse(storedOverrides) : {};
  });

  const loadCart = useCallback(async () => {
    const response = await axios.get('/api/cart-items?expand=product');
    setCart(response.data);
  }, []);

  const loadProducts = useCallback(async () => {
    const response = await axios.get('/api/products');
    setProducts(response.data);
  }, []);

  const loadOrders = useCallback(async () => {
    const response = await axios.get('/api/orders?expand=products');
    setOrders(response.data);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(trackingStorageKey, JSON.stringify(trackingOverrides));
  }, [trackingOverrides]);

  useEffect(() => {
    if (!currentUser) {
      setFavoriteIds([]);
      setCart([]);
      setOrders([]);
      return;
    }

    loadCart();
    loadOrders();
    setFavoriteIds(loadFavorites(currentUser.email));
  }, [currentUser, loadCart, loadOrders]);

  const handleLogin = (user: DemoUser) => {
    localStorage.setItem(authStorageKey, JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleSignOut = () => {
    localStorage.removeItem(authStorageKey);
    setCurrentUser(null);
    setSearchTerm('');
  };

  const handleTrackingStepChange = (orderId: string, productId: string, stepIndex: number) => {
    setTrackingOverrides((currentOverrides) => ({
      ...currentOverrides,
      [`${orderId}:${productId}`]: stepIndex
    }));
  };

  const handleToggleFavorite = (productId: string) => {
    if (!currentUser) {
      return;
    }

    const nextFavorites = toggleFavorite(currentUser.email, productId);
    setFavoriteIds(nextFavorites);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = [product.name, product.keywords?.join(' ')]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [products, searchTerm]);

  const favoriteProducts = useMemo(
    () => filteredProducts.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds, filteredProducts]
  );

  const headerProps: HeaderProps = {
    cart,
    currentUser,
    favoritesCount: favoriteIds.length,
    onSignOut: handleSignOut,
    searchTerm,
    onSearchChange: setSearchTerm,
    theme,
    onThemeToggle: () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  };

  const requireAuth = (element: React.ReactNode) => (
    currentUser ? element : <Navigate to="/login" replace />
  );

  return (
    <Routes>
      <Route path="/login" element={<LoginPage currentUser={currentUser} onLogin={handleLogin} />} />
      <Route
        path="/"
        element={requireAuth(
          <HomePage
            {...headerProps}
            cart={cart}
            loadCart={loadCart}
            currentUser={currentUser}
            products={filteredProducts}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      />
      <Route path="/checkout" element={requireAuth(<CheckoutPage cart={cart} loadCart={loadCart} />)} />

      <Route
        path="/admin/products"
        element={requireAuth(
          <ProductManagementPage
            {...headerProps}
            cart={cart}
            currentUser={currentUser}
            products={products}
            onProductsChange={setProducts}
          />
        )}
      />
      <Route
        path="/orders"
        element={requireAuth(
          <OrdersPage
            {...headerProps}
            cart={cart}
            currentUser={currentUser}
            orders={orders}
            loadOrders={loadOrders}
            favoritesCount={favoriteIds.length}
            loadCart={loadCart}
          />
        )}
      />
      <Route
        path="/favorites"
        element={requireAuth(
          <FavoritesPage
            {...headerProps}
            cart={cart}
            currentUser={currentUser}
            favoriteProducts={favoriteProducts}
            onToggleFavorite={handleToggleFavorite}
            loadCart={loadCart}
          />
        )}
      />
      <Route
        path="/tracking/:orderId/:productId"
        element={requireAuth(
          <TrackingPage
            {...headerProps}
            cart={cart}
            orders={orders}
            currentUser={currentUser}
            favoritesCount={favoriteIds.length}
            trackingOverrides={trackingOverrides}
            onTrackingStepChange={handleTrackingStepChange}
          />
        )}
      />
    </Routes>
  );
}

export default App;
