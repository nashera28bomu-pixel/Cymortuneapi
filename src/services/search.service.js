/**
 * @file services/search.service.js
 * @description Business logic for all search operations.
 */

import cache from '../config/cache.js';
import provider from '../services/provider.js';
import normalizer from '../utils/normalizer.js';
import { ValidationError } from '../utils/errors.js';

const requireQuery = (q) => {
  if (!q || typeof q !== 'string' || !q.trim()) {
    throw new ValidationError("'query' is required");
  }
  return q.trim().slice(0, 200);
};

export const searchAll = async (query, page = 1, limit = 10) => {
  const q = requireQuery(query);
  const key = cache.buildKey('search:all', q, page, limit);
  return cache.remember(key, async () => {
    const raw = await provider.searchAll(q, page, limit);
    return normalizer.normalizeSearchResults(raw);
  });
};

export const searchSongs = async (query, page = 1, limit = 20) => {
  const q = requireQuery(query);
  const key = cache.buildKey('search:songs', q, page, limit);
  return cache.remember(key, async () => {
    const raw = await provider.searchSongs(q, page, limit);
    return {
      total: raw.total || 0,
      page: parseInt(page),
      items: normalizer.normalizeSongs(raw.results || []),
    };
  });
};

export const searchAlbums = async (query, page = 1, limit = 20) => {
  const q = requireQuery(query);
  const key = cache.buildKey('search:albums', q, page, limit);
  return cache.remember(key, async () => {
    const raw = await provider.searchAlbums(q, page, limit);
    return {
      total: raw.total || 0,
      page: parseInt(page),
      items: (raw.results || []).map(normalizer.normalizeAlbum).filter(Boolean),
    };
  });
};

export const searchArtists = async (query, page = 1, limit = 20) => {
  const q = requireQuery(query);
  const key = cache.buildKey('search:artists', q, page, limit);
  return cache.remember(key, async () => {
    const raw = await provider.searchArtists(q, page, limit);
    return {
      total: raw.total || 0,
      page: parseInt(page),
      items: (raw.results || []).map((a) => ({
        id: a.id,
        name: a.name,
        image: a.image?.[2]?.url || a.image?.[0]?.url || null,
        follower_count: a.followerCount || null,
      })),
    };
  });
};

export const searchPlaylists = async (query, page = 1, limit = 20) => {
  const q = requireQuery(query);
  const key = cache.buildKey('search:playlists', q, page, limit);
  return cache.remember(key, async () => {
    const raw = await provider.searchPlaylists(q, page, limit);
    return {
      total: raw.total || 0,
      page: parseInt(page),
      items: (raw.results || []).map(normalizer.normalizePlaylist).filter(Boolean),
    };
  });
};

export default { searchAll, searchSongs, searchAlbums, searchArtists, searchPlaylists };
