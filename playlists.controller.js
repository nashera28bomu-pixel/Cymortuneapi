/**
 * @file controllers/playlists.controller.js
 */

import playlistsService from '../services/playlists.service.js';
import response from '../utils/response.js';

export const getPlaylist = async (req, res, next) => {
  try {
    const { link, page = 1, limit = 50 } = req.query;
    const data = await playlistsService.getPlaylist(req.params.id || null, link || null, page, limit);
    return response.success(res, data, 'Playlist fetched');
  } catch (err) { next(err); }
};
