/**
 * @file services/provider.js
 * @description JioSaavn provider layer.
 * The ONLY file that communicates with the upstream API.
 * If the provider changes, only this file and the normalizer need updating.
 */

import client from '../config/axios.js';
import logger from '../utils/logger.js';

const get = async (path, params = {}) => {
  try {
    const res = await client.get(path, { params });
    return res.data?.data ?? res.data ?? {};
  } catch (err) {
    logger.error(`[Provider] GET ${path} failed:`, err.message);
    throw err;
  }
};

// ── Search ────────────────────────────────────────────────────────────────────
export const searchAll     = (query, page = 1, limit = 10) =>
  get('/search', { query, page, limit });

export const searchSongs   = (query, page = 1, limit = 20) =>
  get('/search/songs', { query, page, limit });

export const searchAlbums  = (query, page = 1, limit = 20) =>
  get('/search/albums', { query, page, limit });

export const searchArtists = (query, page = 1, limit = 20) =>
  get('/search/artists', { query, page, limit });

export const searchPlaylists = (query, page = 1, limit = 20) =>
  get('/search/playlists', { query, page, limit });

// ── Songs ─────────────────────────────────────────────────────────────────────
export const getSongById       = (id)         => get('/songs', { id });
export const getSongsByIds     = (ids)        => get('/songs', { id: ids.join(',') });
export const getSongLyrics     = (id)         => get(`/songs/${id}/lyrics`);
export const getSongSuggestions = (id, limit = 10) =>
  get(`/songs/${id}/suggestions`, { limit });

// ── Albums ────────────────────────────────────────────────────────────────────
export const getAlbumById  = (id)   => get('/albums', { id });
export const getAlbumByLink = (link) => get('/albums', { link });

// ── Artists ───────────────────────────────────────────────────────────────────
export const getArtistById       = (id, page = 0, songCount = 40, albumCount = 20) =>
  get(`/artists/${id}`, { page, songCount, albumCount });

export const getArtistSongs  = (id, page = 0, sortBy = 'popularity', sortOrder = 'desc') =>
  get(`/artists/${id}/songs`, { page, sortBy, sortOrder });

export const getArtistAlbums = (id, page = 0, sortBy = 'popularity', sortOrder = 'desc') =>
  get(`/artists/${id}/albums`, { page, sortBy, sortOrder });

// ── Playlists ─────────────────────────────────────────────────────────────────
export const getPlaylistById   = (id, page = 1, limit = 50) =>
  get('/playlists', { id, page, limit });

export const getPlaylistByLink = (link, page = 1, limit = 50) =>
  get('/playlists', { link, page, limit });

// ── Charts / Trending ─────────────────────────────────────────────────────────
// JioSaavn exposes trending via specific curated playlist IDs
// These are stable JioSaavn playlist IDs for popular charts
export const getTopCharts = () =>
  get('/playlists', { id: '1134543272' }); // Top 50 Hindi

export const getTopEnglish = () =>
  get('/playlists', { id: '1134543278' }); // Top 50 English

export const getTopPop = () =>
  get('/search/songs', { query: 'top hits 2024 2025', page: 1, limit: 30 });

export const getNewReleases = () =>
  get('/search/songs', { query: 'new releases 2025', page: 1, limit: 30 });

export default {
  searchAll, searchSongs, searchAlbums, searchArtists, searchPlaylists,
  getSongById, getSongsByIds, getSongLyrics, getSongSuggestions,
  getAlbumById, getAlbumByLink,
  getArtistById, getArtistSongs, getArtistAlbums,
  getPlaylistById, getPlaylistByLink,
  getTopCharts, getTopEnglish, getTopPop, getNewReleases,
};
