/**
 * @file controllers/artists.controller.js
 */

import artistsService from '../services/artists.service.js';
import response from '../utils/response.js';

export const getArtist = async (req, res, next) => {
  try {
    const data = await artistsService.getArtist(req.params.id);
    return response.success(res, data, 'Artist fetched');
  } catch (err) { next(err); }
};

export const getArtistSongs = async (req, res, next) => {
  try {
    const { page = 0, sortBy = 'popularity', sortOrder = 'desc' } = req.query;
    const data = await artistsService.getArtistSongs(req.params.id, page, sortBy, sortOrder);
    return response.success(res, data, 'Artist songs fetched');
  } catch (err) { next(err); }
};

export const getArtistAlbums = async (req, res, next) => {
  try {
    const { page = 0 } = req.query;
    const data = await artistsService.getArtistAlbums(req.params.id, page);
    return response.success(res, data, 'Artist albums fetched');
  } catch (err) { next(err); }
};
