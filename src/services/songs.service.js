/**
 * @file services/songs.service.js
 * @description Business logic for song operations.
 */

import cache from '../config/cache.js';
import provider from '../services/provider.js';
import normalizer from '../utils/normalizer.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getSong = async (id) => {
  if (!id) throw new ValidationError("'id' is required");
  const key = cache.buildKey('song', id);
  return cache.remember(key, async () => {
    const raw = await provider.getSongById(id);
    const songs = Array.isArray(raw) ? raw : [raw];
    const song = normalizer.normalizeSong(songs[0]);
    if (!song) throw new NotFoundError(`Song not found: ${id}`);
    return song;
  });
};

export const getSongs = async (ids) => {
  if (!ids?.length) throw new ValidationError("'ids' array is required");
  const key = cache.buildKey('songs', ids.join(','));
  return cache.remember(key, async () => {
    const raw = await provider.getSongsByIds(ids);
    return normalizer.normalizeSongs(Array.isArray(raw) ? raw : [raw]);
  });
};

export const getLyrics = async (id) => {
  if (!id) throw new ValidationError("'id' is required");
  const key = cache.buildKey('lyrics', id);
  return cache.remember(key, async () => {
    const raw = await provider.getSongLyrics(id);
    return {
      id,
      lyrics: raw.lyrics || null,
      copyright: raw.copyright || null,
      snippet: raw.snippet || null,
    };
  }, 3600);
};

export const getSuggestions = async (id, limit = 10) => {
  if (!id) throw new ValidationError("'id' is required");
  const key = cache.buildKey('suggestions', id, limit);
  return cache.remember(key, async () => {
    const raw = await provider.getSongSuggestions(id, limit);
    return normalizer.normalizeSongs(Array.isArray(raw) ? raw : []);
  });
};

export default { getSong, getSongs, getLyrics, getSuggestions };
