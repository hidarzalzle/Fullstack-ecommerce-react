const prefix = 'northstar-favorites:';

export function getFavoritesKey(email) {
  return `${prefix}${email}`;
}

export function loadFavorites(email) {
  if (!email) {
    return [];
  }

  const stored = localStorage.getItem(getFavoritesKey(email));

  try {
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(email, favorites) {
  if (!email) {
    return;
  }

  localStorage.setItem(getFavoritesKey(email), JSON.stringify(favorites));
}

export function toggleFavorite(email, productId) {
  const currentFavorites = loadFavorites(email);
  const nextFavorites = currentFavorites.includes(productId)
    ? currentFavorites.filter((id) => id !== productId)
    : [...currentFavorites, productId];

  saveFavorites(email, nextFavorites);
  return nextFavorites;
}
