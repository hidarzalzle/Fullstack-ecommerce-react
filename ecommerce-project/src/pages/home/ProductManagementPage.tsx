import axios from 'axios';
import { Navigate } from 'react-router';
import { useMemo, useState } from 'react';
import { Header } from '../../components/Header';
import '../../App.css';
import './ProductManagementPage.css';

type Product = {
  id: string;
  name: string;
  image: string;
  priceCents: number;
  keywords?: string[];
  rating?: {
    stars?: number;
    count?: number;
  };
};

type DemoUser = {
  name: string;
  role: string;
};

type ProductForm = {
  id: string | null;
  name: string;
  image: string;
  priceCents: string;
  keywords: string;
  ratingStars: string;
  ratingCount: string;
};

type ProductManagementPageProps = {
  cart: {
    productId: string;
    quantity: number;
    deliveryOptionId: string;
  }[];
  currentUser: DemoUser | null;
  favoritesCount?: number;
  onSignOut?: () => void;
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  theme?: string;
  onThemeToggle?: () => void;
  products: Product[];
  onProductsChange: (products: Product[]) => void;
};

const emptyForm: ProductForm = {
  id: null,
  name: '',
  image: '',
  priceCents: '',
  keywords: '',
  ratingStars: '0',
  ratingCount: '0'
};

function toFormState(product?: Product | null): ProductForm {
  if (!product) {
    return emptyForm;
  }

  return {
    id: product.id,
    name: product.name,
    image: product.image,
    priceCents: String(product.priceCents),
    keywords: (product.keywords ?? []).join(', '),
    ratingStars: String(product.rating?.stars ?? 0),
    ratingCount: String(product.rating?.count ?? 0)
  };
}

export function ProductManagementPage({
  cart,
  currentUser,
  products,
  onProductsChange,
  ...headerProps
}: ProductManagementPageProps) {
  const [productForm, setProductForm] = useState<ProductForm>(emptyForm);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adminProducts = useMemo(
    () => products.map((product) => ({ id: product.id, name: product.name })),
    [products]
  );

  if (currentUser?.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setProductForm(emptyForm);
    setFormError('');
  };

  const handleFieldChange = (field: keyof ProductForm, value: string) => {
    setProductForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  };

  const handleEditSelection = (productId: string) => {
    if (!productId) {
      resetForm();
      setFormMessage('');
      return;
    }

    const selectedProduct = products.find((product) => product.id === productId);
    setProductForm(toFormState(selectedProduct));
    setFormMessage('Editing selected product. Save changes when ready.');
    setFormError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: productForm.name,
      image: productForm.image,
      priceCents: Number(productForm.priceCents),
      keywords: productForm.keywords,
      ratingStars: Number(productForm.ratingStars),
      ratingCount: Number(productForm.ratingCount)
    };

    setIsSubmitting(true);
    setFormMessage('');
    setFormError('');

    try {
      if (productForm.id) {
        const response = await axios.put(`/api/products/${productForm.id}`, payload);
        onProductsChange(products.map((product) => product.id === productForm.id ? response.data : product));
        setProductForm(toFormState(response.data));
        setFormMessage('Product updated successfully.');
      } else {
        const response = await axios.post('/api/products', payload);
        onProductsChange([...products, response.data]);
        setProductForm(emptyForm);
        setFormMessage('Product added successfully.');
      }
    } catch (error: any) {
      setFormError(error.response?.data?.message ?? 'Unable to save the product right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <title>Product Management</title>

      <Header {...headerProps} cart={cart} currentUser={currentUser} />

      <div className="product-management-page">
        <section className="management-shell">
          <div className="management-hero">
            <div>
              <div className="eyebrow">Dedicated inventory workspace</div>
              <h1>Manage your catalog without leaving the admin flow.</h1>
              <p>
                Create products, revise pricing, and refresh merchandising details from one focused page.
              </p>
            </div>

            <div className="management-summary-card">
              <span>Total products</span>
              <strong>{products.length}</strong>
              <small>Admin-only access</small>
            </div>
          </div>

          <form className="management-form-card" onSubmit={handleSubmit}>
            <label>
              Edit existing item
              <select
                value={productForm.id ?? ''}
                onChange={(event) => handleEditSelection(event.target.value)}
              >
                <option value="">Create a new product</option>
                {adminProducts.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </label>

            <div className="management-form-grid">
              <label>
                Product name
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(event) => handleFieldChange('name', event.target.value)}
                  placeholder="Aurora performance jacket"
                />
              </label>

              <label>
                Image path
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(event) => handleFieldChange('image', event.target.value)}
                  placeholder="images/products/aurora-jacket.jpg"
                />
              </label>

              <label>
                Price in cents
                <input
                  type="number"
                  min="0"
                  value={productForm.priceCents}
                  onChange={(event) => handleFieldChange('priceCents', event.target.value)}
                  placeholder="12999"
                />
              </label>

              <label>
                Keywords
                <input
                  type="text"
                  value={productForm.keywords}
                  onChange={(event) => handleFieldChange('keywords', event.target.value)}
                  placeholder="jacket, outerwear, winter"
                />
              </label>

              <label>
                Rating stars
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={productForm.ratingStars}
                  onChange={(event) => handleFieldChange('ratingStars', event.target.value)}
                />
              </label>

              <label>
                Rating count
                <input
                  type="number"
                  min="0"
                  value={productForm.ratingCount}
                  onChange={(event) => handleFieldChange('ratingCount', event.target.value)}
                />
              </label>
            </div>

            {formMessage ? <div className="admin-form-message success">{formMessage}</div> : null}
            {formError ? <div className="admin-form-message error">{formError}</div> : null}

            <div className="management-form-actions">
              <button className="button-secondary" type="button" onClick={resetForm}>
                Clear
              </button>
              <button className="button-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : productForm.id ? 'Update product' : 'Add product'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
