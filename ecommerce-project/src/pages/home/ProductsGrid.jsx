import { useEffect, useMemo, useState } from 'react';
import { Product } from './Product';

const PRODUCTS_PER_PAGE = 8;

export function ProductsGrid({ products, loadCart, favoriteIds = [], onToggleFavorite }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [currentPage, products]);

  return (
    <div className="products-grid-section">
      <div className="products-grid">
        {paginatedProducts.map((product) => (
          <Product
            key={product.id}
            product={product}
            loadCart={loadCart}
            isFavorite={favoriteIds.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      <div className="pagination-bar">
        <p>
          Showing <strong>{products.length ? (currentPage - 1) * PRODUCTS_PER_PAGE + 1 : 0}</strong>-<strong>{Math.min(currentPage * PRODUCTS_PER_PAGE, products.length)}</strong> of <strong>{products.length}</strong> products
        </p>
        <div className="pagination-controls">
          <button
            className="button-secondary pagination-button"
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-page-indicator">Page {currentPage} of {totalPages}</span>
          <button
            className="button-secondary pagination-button"
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
