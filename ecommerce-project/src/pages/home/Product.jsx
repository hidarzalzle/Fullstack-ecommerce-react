import axios from 'axios';
import { useState } from 'react';
import { formatMoney } from '../../utils/money';

export function Product({ product, loadCart, isFavorite, onToggleFavorite }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const addToCart = async () => {
    await axios.post('/api/cart-items', {
      productId: product.id,
      quantity
    });
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1500);
    await loadCart();
  };

  return (
    <div className="product-container" data-testid="product-container">
      <button
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
        type="button"
        onClick={() => onToggleFavorite?.(product.id)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        ♥
      </button>

      <div className="product-image-container">
        <img className="product-image" data-testid="product-image" src={product.image} />
      </div>

      <div className="product-name limit-text-to-2-lines">{product.name}</div>

      <div className="product-rating-container">
        <img
          className="product-rating-stars"
          data-testid="product-rating-stars-image"
          src={`images/ratings/rating-${product.rating.stars * 10}.png`}
        />
        <div className="product-rating-count link-primary">{product.rating.count}</div>
      </div>

      <div className="product-price">{formatMoney(product.priceCents)}</div>

      <div className="product-quantity-container">
        <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div className="product-spacer"></div>

      <div className={`added-to-cart ${isAdded ? 'visible' : ''}`}>
        <img src="images/icons/checkmark.png" />
        Added to cart
      </div>

      <button className="add-to-cart-button button-primary" data-testid="add-to-cart-button" onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
}
