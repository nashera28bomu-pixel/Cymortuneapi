/**
 * @file controllers/albums.controller.js
 */

import albumsService from '../services/albums.service.js';
import response from '../utils/response.js';

export const getAlbum = async (req, res, next) => {
  try {
    const { link } = req.query;
    const data = await albumsService.getAlbum(req.params.id || null, link || null);
    return response.success(res, data, 'Album fetched');
  } catch (err) { next(err); }
};
