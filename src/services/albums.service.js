/**
 * @file services/albums.service.js
 */

import cache from '../config/cache.js';
import provider from '../services/provider.js';
import normalizer from '../utils/normalizer.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getAlbum = async (id, link) => {
  if (!id && !link) throw new ValidationError("'id' or 'link' is required");
  const key = cache.buildKey('album', id || link);
  return cache.remember(key, async () => {
    const raw = id
      ? await provider.getAlbumById(id)
      : await provider.getAlbumByLink(link);
    const album = normalizer.normalizeAlbum(raw);
    if (!album) throw new NotFoundError('Album not found');
    return album;
  });
};

export default { getAlbum };
