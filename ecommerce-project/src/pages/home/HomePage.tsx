import axios from 'axios';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';

type Product = {
  id: string;
  name: string;
  image: string;
  priceCents: number;
  keywords?: string[];
};

type DemoUser = {
  role: string;
  name: string;
};

type CartItem = {
  productId: string;
  quantity: number;
  deliveryOptionId: string;
};

type HomePageProps = {
  cart: CartItem[];
  loadCart: () => Promise<void>;
  currentUser?: DemoUser | null;
  products?: Product[] | null;
  favoriteIds?: string[];
  onToggleFavorite?: (productId: string) => void;
  favoritesCount?: number;
  onSignOut?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  theme?: string;
  onThemeToggle?: () => void;
};

export function HomePage({
  cart,
  loadCart,
  currentUser = null,
  products: providedProducts = null,
  favoriteIds = [],
  onToggleFavorite,
  ...headerProps
}: HomePageProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (providedProducts !== null) {
      return;
    }

    const getHomeData = async () => {
      const response = await axios.get('/api/products');
      setLocalProducts(response.data);
    };

    getHomeData();
  }, [providedProducts]);

  const products = providedProducts ?? localProducts;
  const isAdmin = currentUser?.role === 'Admin';

  const heroStats = [
    { label: 'Live products', value: products.length },
    { label: 'Favorites saved', value: favoriteIds.length },
    { label: 'Cart items', value: cart.reduce((sum, item) => sum + item.quantity, 0) }
  ];

  return (
    <>
      <title>Ecommerce Project</title>

      <Header {...headerProps} cart={cart} currentUser={currentUser} favoritesCount={favoriteIds.length} />

      <div className="home-page">
        <section className="hero-panel">
          <div>
            <div className="eyebrow">Curated storefront</div>
            <h1>Cutting-edge commerce in a cinematic dark theme.</h1>
            <p>
              Discover products, build personalized favorites, and jump into order tracking without
              leaving the experience.
            </p>
          </div>

          <div className="hero-stats-grid">
            {heroStats.map((stat) => (
              <div key={stat.label} className="hero-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {isAdmin ? (
          <section className="admin-callout-panel">
            <div className="admin-panel-copy">
              <div className="eyebrow">Admin inventory tools</div>
              <h2>Manage products from a dedicated workspace.</h2>
              <p>Open the product management page to add new items or update existing inventory.</p>
            </div>

            <Link className="button-primary admin-callout-action" to="/admin/products">
              Open product management
            </Link>
          </section>
        ) : null}

        <ProductsGrid
          products={products}
          loadCart={loadCart}
          favoriteIds={favoriteIds as any}
          onToggleFavorite={onToggleFavorite as any}
        />
      </div>
    </>
  );
}
