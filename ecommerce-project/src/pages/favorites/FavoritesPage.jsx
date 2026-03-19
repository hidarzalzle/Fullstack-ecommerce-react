import { Header } from '../../components/Header';
import { ProductsGrid } from '../home/ProductsGrid';

export function FavoritesPage({ cart, currentUser, favoriteProducts, onToggleFavorite, loadCart, ...headerProps }) {
  return (
    <>
      <title>Favorites</title>
      <Header {...headerProps} cart={cart} currentUser={currentUser} favoritesCount={favoriteProducts.length} />
      <div className="home-page favorites-page">
        <section className="favorites-hero">
          <div>
            <div className="eyebrow">Personal shortlist</div>
            <h1>{currentUser.name.split(' ')[0]}'s saved favorites</h1>
            <p>
              Your favorites are stored separately for each demo login, so admin and shopper accounts
              can maintain different wishlists.
            </p>
          </div>
          <div className="favorites-count-card">
            <strong>{favoriteProducts.length}</strong>
            <span>Items saved</span>
          </div>
        </section>

        {favoriteProducts.length ? (
          <ProductsGrid
            products={favoriteProducts}
            loadCart={loadCart}
            favoriteIds={favoriteProducts.map((product) => product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ) : (
          <div className="empty-state-card">
            <h2>No favorites yet</h2>
            <p>Tap the heart on any product card to build your personal list.</p>
          </div>
        )}
      </div>
    </>
  );
}
