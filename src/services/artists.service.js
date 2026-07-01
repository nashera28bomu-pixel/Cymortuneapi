/**
 * @file services/artists.service.js
 */

import cache from '../config/cache.js';
import provider from '../services/provider.js';
import normalizer from '../utils/normalizer.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getArtist = async (id) => {
  if (!id) throw new ValidationError("'id' is required");
  const key = cache.buildKey('artist', id);
  return cache.remember(key, async () => {
    const raw = await provider.getArtistById(id);
    const artist = normalizer.normalizeArtist(raw);
    if (!artist) throw new NotFoundError('Artist not found');
    return artist;
  });
};

export const getArtistSongs = async (id, page = 0, sortBy = 'popularity', sortOrder = 'desc') => {
  if (!id) throw new ValidationError("'id' is required");
  const key = cache.buildKey('artist:songs', id, page, sortBy, sortOrder);
  return cache.remember(key, async () => {
    const raw = await provider.getArtistSongs(id, page, sortBy, sortOrder);
    return {
      artist_id: id,
      page,
      items: normalizer.normalizeSongs(raw.songs || raw.results || []),
    };
  });
};

export const getArtistAlbums = async (id, page = 0) => {
  if (!id) throw new ValidationError("'id' is required");
  const key = cache.buildKey('artist:albums', id, page);
  return cache.remember(key, async () => {
    const raw = await provider.getArtistAlbums(id, page);
    return {
      artist_id: id,
      page,
      items: (raw.albums || raw.results || []).map(normalizer.normalizeAlbum).filter(Boolean),
    };
  });
};

export default { getArtist, getArtistSongs, getArtistAlbums };
