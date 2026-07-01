/**
 * @file controllers/songs.controller.js
 */

import songsService from '../services/songs.service.js';
import response from '../utils/response.js';

export const getSong = async (req, res, next) => {
  try {
    const data = await songsService.getSong(req.params.id);
    return response.success(res, data, 'Song fetched');
  } catch (err) { next(err); }
};

export const getLyrics = async (req, res, next) => {
  try {
    const data = await songsService.getLyrics(req.params.id);
    return response.success(res, data, 'Lyrics fetched');
  } catch (err) { next(err); }
};

export const getSuggestions = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const data = await songsService.getSuggestions(req.params.id, limit);
    return response.success(res, data, 'Suggestions fetched');
  } catch (err) { next(err); }
};
