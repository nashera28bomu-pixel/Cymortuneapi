/**
 * @file controllers/search.controller.js
 */

import searchService from '../services/search.service.js';
import response from '../utils/response.js';

export const searchAll = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const data = await searchService.searchAll(q, page, limit);
    return response.success(res, data, `Search results for "${q}"`);
  } catch (err) { next(err); }
};

export const searchSongs = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const data = await searchService.searchSongs(q, page, limit);
    return response.success(res, data, `Songs matching "${q}"`);
  } catch (err) { next(err); }
};

export const searchAlbums = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const data = await searchService.searchAlbums(q, page, limit);
    return response.success(res, data, `Albums matching "${q}"`);
  } catch (err) { next(err); }
};

export const searchArtists = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const data = await searchService.searchArtists(q, page, limit);
    return response.success(res, data, `Artists matching "${q}"`);
  } catch (err) { next(err); }
};

export const searchPlaylists = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const data = await searchService.searchPlaylists(q, page, limit);
    return response.success(res, data, `Playlists matching "${q}"`);
  } catch (err) { next(err); }
};
