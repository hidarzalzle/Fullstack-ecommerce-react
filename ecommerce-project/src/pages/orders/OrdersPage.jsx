import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { Header } from '../../components/Header';
import { formatMoney } from '../../utils/money';
import './OrdersPage.css';

export function OrdersPage({ cart, currentUser, orders, loadOrders, favoritesCount, loadCart, ...headerProps }) {
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleBuyAgain = async (productId) => {
    await axios.post('/api/cart-items', { productId, quantity: 1 });
    await loadCart();
  };

  const handleShareOrder = (order) => {
    const shareUrl = new URL('https://www.facebook.com/sharer/sharer.php');
    const currentPageUrl = typeof window !== 'undefined' ? window.location.href : '';

    shareUrl.searchParams.set('u', currentPageUrl);
    shareUrl.searchParams.set('quote', `Check out my order #${order.id} from Northstar Market.`);

    window.open(shareUrl.toString(), '_blank', 'noopener,noreferrer,width=640,height=720');
  };

  return (
    <>
      <title>Orders</title>

      <Header {...headerProps} cart={cart} currentUser={currentUser} favoritesCount={favoritesCount} />

      <div className="orders-page">
        <div className="page-heading-row">
          <div>
            <div className="page-title">Your Orders</div>
            <p className="page-subtitle">Track every shipment and instantly buy your top items again.</p>
          </div>
          <div className="order-highlight-card">
            <strong>{orders.length}</strong>
            <span>Orders in history</span>
          </div>
        </div>

        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-container">
              <div className="order-header">
                <div className="order-header-left-section">
                  <div className="order-date">
                    <div className="order-header-label">Order Placed:</div>
                    <div>{dayjs(order.orderTimeMs).format('MMMM D, YYYY')}</div>
                  </div>
                  <div className="order-total">
                    <div className="order-header-label">Total:</div>
                    <div>{formatMoney(order.totalCostCents)}</div>
                  </div>
                </div>

                <div className="order-header-right-section">
                  <div className="order-header-label">Order ID:</div>
                  <div>{order.id}</div>
                  <button className="share-order-button button-secondary" onClick={() => handleShareOrder(order)} aria-label={`Share order ${order.id} on Facebook`}>
                    <span className="share-order-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.6-1.6h1.7V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.4V11H7.5v3h2.7v8h3.3Z" />
                      </svg>
                    </span>
                    <span>Share on Facebook</span>
                  </button>
                </div>
              </div>

              <div className="order-details-grid">
                {order.products.map((orderProduct) => (
                  <div key={orderProduct.product.id} className="order-product-row">
                    <div className="product-image-container">
                      <img src={orderProduct.product.image} />
                    </div>

                    <div className="product-details">
                      <div className="product-name">{orderProduct.product.name}</div>
                      <div className="product-delivery-date">
                        Arriving on: {dayjs(orderProduct.estimatedDeliveryTimeMs).format('MMMM D, YYYY')}
                      </div>
                      <div className="product-quantity">Quantity: {orderProduct.quantity}</div>
                      <button className="buy-again-button button-primary" onClick={() => handleBuyAgain(orderProduct.product.id)}>
                        <img className="buy-again-icon" src="images/icons/buy-again.png" />
                        <span className="buy-again-message">Add to Cart</span>
                      </button>
                    </div>

                    <div className="product-actions">
                      <Link to={`/tracking/${order.id}/${orderProduct.product.id}`}>
                        <button className="track-package-button button-secondary">Track package</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
