import express from 'express';
import { Product } from '../models/Product.js';

const router = express.Router();

function normalizeProductPayload(body = {}) {
  const keywords = Array.isArray(body.keywords)
    ? body.keywords
    : String(body.keywords ?? '')
        .split(',')
        .map((keyword) => keyword.trim())
        .filter(Boolean);

  const priceCents = Number(body.priceCents);
  const ratingStars = Number(body.rating?.stars ?? body.ratingStars ?? 0);
  const ratingCount = Number(body.rating?.count ?? body.ratingCount ?? 0);

  return {
    image: String(body.image ?? '').trim(),
    name: String(body.name ?? '').trim(),
    priceCents,
    keywords,
    rating: {
      stars: Number.isFinite(ratingStars) ? ratingStars : 0,
      count: Number.isFinite(ratingCount) ? ratingCount : 0
    }
  };
}

function validateProductPayload(payload) {
  if (!payload.name) {
    return 'Product name is required.';
  }

  if (!payload.image) {
    return 'Product image is required.';
  }

  if (!Number.isInteger(payload.priceCents) || payload.priceCents < 0) {
    return 'Price must be a whole number of cents.';
  }

  if (!Array.isArray(payload.keywords) || payload.keywords.length === 0) {
    return 'At least one keyword is required.';
  }

  if (!Number.isFinite(payload.rating.stars) || payload.rating.stars < 0 || payload.rating.stars > 5) {
    return 'Rating stars must be between 0 and 5.';
  }

  if (!Number.isInteger(payload.rating.count) || payload.rating.count < 0) {
    return 'Rating count must be a whole number.';
  }

  return null;
}

router.get('/', async (req, res) => {
  const search = req.query.search;

  let products;
  if (search) {
    products = await Product.findAll();

    const lowerCaseSearch = search.toLowerCase();

    products = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(lowerCaseSearch);
      const keywordsMatch = product.keywords.some(keyword => keyword.toLowerCase().includes(lowerCaseSearch));
      return nameMatch || keywordsMatch;
    });
  } else {
    products = await Product.findAll();
  }

  res.json(products);
});

router.post('/', async (req, res) => {
  const payload = normalizeProductPayload(req.body);
  const validationError = validateProductPayload(payload);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const product = await Product.create(payload);
  return res.status(201).json(product);
});

router.put('/:productId', async (req, res) => {
  const product = await Product.findByPk(req.params.productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }

  const payload = normalizeProductPayload(req.body);
  const validationError = validateProductPayload(payload);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  await product.update(payload);
  return res.json(product);
});

export default router;
