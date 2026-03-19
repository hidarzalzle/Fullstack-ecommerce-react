import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { Header } from '../../components/Header';

const trackingSteps = [
  'Order confirmed',
  'Packed in dark hub',
  'Out for delivery',
  'Estimated arrival'
];

export function TrackingPage({
  cart,
  orders,
  currentUser,
  favoritesCount,
  trackingOverrides = {},
  onTrackingStepChange,
  ...headerProps
}) {
  const { orderId, productId } = useParams();
  const isAdmin = currentUser?.role === 'Admin';

  const trackedItem = useMemo(() => {
    const order = orders.find((entry) => entry.id === orderId);
    const product = order?.products.find((entry) => entry.product?.id === productId);
    return order && product ? { order, product } : null;
  }, [orderId, orders, productId]);

  if (!trackedItem) {
    return (
      <>
        <Header {...headerProps} cart={cart} currentUser={currentUser} favoritesCount={favoritesCount} />
        <div className="tracking-page empty-state-card not-found-state">
          <h1>Tracking unavailable</h1>
          <p>We could not find that shipment. Open your orders and choose a package to track.</p>
          <Link className="button-primary inline-action" to="/orders">Back to orders</Link>
        </div>
      </>
    );
  }

  const { order, product } = trackedItem;
  const overrideKey = `${order.id}:${product.product.id}`;
  const selectedStepIndex = Number.isInteger(trackingOverrides[overrideKey]) ? trackingOverrides[overrideKey] : null;
  const orderDate = dayjs(order.orderTimeMs);
  const deliveryDate = dayjs(product.estimatedDeliveryTimeMs);
  const totalWindow = Math.max(deliveryDate.diff(orderDate, 'day'), 1);
  const elapsed = Math.min(Math.max(dayjs().diff(orderDate, 'day'), 0), totalWindow);
  const automaticStepIndex = progressToStepIndex(Math.round((elapsed / totalWindow) * 100));
  const activeStepIndex = selectedStepIndex ?? automaticStepIndex;
  const progress = stepIndexToProgress(activeStepIndex);

  const timeline = [
    { label: 'Order confirmed', date: orderDate.format('MMM D, YYYY') },
    { label: 'Packed in dark hub', date: orderDate.add(1, 'day').format('MMM D, YYYY') },
    { label: 'Out for delivery', date: deliveryDate.subtract(1, 'day').format('MMM D, YYYY') },
    { label: 'Estimated arrival', date: deliveryDate.format('MMM D, YYYY') }
  ].map((step, index) => ({
    ...step,
    done: index <= activeStepIndex,
    active: index === activeStepIndex
  }));

  return (
    <>
      <title>Tracking</title>
      <Header {...headerProps} cart={cart} currentUser={currentUser} favoritesCount={favoritesCount} />
      <div className="tracking-page">
        <div className="tracking-shell">
          <div className="tracking-copy">
            <div className="eyebrow">Live tracking</div>
            <h1>{product.product.name}</h1>
            <p>Order <strong>{order.id}</strong> is moving through the Northstar delivery network.</p>
            <div className="tracking-progress-card">
              <div className="tracking-progress-header">
                <span>Shipment progress</span>
                <strong>{progress}%</strong>
              </div>
              <div className="tracking-progress-bar">
                <span style={{ width: `${progress}%` }} />
              </div>
              <div className="tracking-progress-caption">
                Estimated arrival: {deliveryDate.format('dddd, MMMM D, YYYY')}
              </div>
            </div>

            {isAdmin ? (
              <div className="tracking-admin-panel">
                <label>
                  Update tracking step
                  <select
                    value={activeStepIndex}
                    onChange={(event) => onTrackingStepChange?.(order.id, product.product.id, Number(event.target.value))}
                  >
                    {trackingSteps.map((step, index) => (
                      <option key={step} value={index}>{step}</option>
                    ))}
                  </select>
                </label>
                <p>Admin accounts can manually move this package through each delivery milestone.</p>
              </div>
            ) : null}
          </div>
          <div className="tracking-product-card">
            <img src={product.product.image} alt={product.product.name} />
          </div>
        </div>

        <div className="tracking-timeline">
          {timeline.map((step) => (
            <div key={step.label} className={`timeline-card ${step.done ? 'done' : ''} ${step.active ? 'active' : ''}`}>
              <div className="timeline-dot" />
              <div>
                <strong>{step.label}</strong>
                <p>{step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function stepIndexToProgress(stepIndex) {
  return [25, 50, 75, 100][stepIndex] ?? 25;
}

function progressToStepIndex(progress) {
  if (progress >= 100) {
    return 3;
  }

  if (progress >= 75) {
    return 2;
  }

  if (progress >= 50) {
    return 1;
  }

  return 0;
}
