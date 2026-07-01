/**
 * @file controllers/trending.controller.js
 */

import trendingService from '../services/trending.service.js';
import response from '../utils/response.js';

export const getTrending = async (req, res, next) => {
  try {
    const data = await trendingService.getTrending();
    return response.success(res, data, 'Trending content fetched');
  } catch (err) { next(err); }
};

export const getCharts = async (req, res, next) => {
  try {
    const data = await trendingService.getCharts();
    return response.success(res, data, 'Charts fetched');
  } catch (err) { next(err); }
};

export const getNewReleases = async (req, res, next) => {
  try {
    const data = await trendingService.getNewReleases();
    return response.success(res, data, 'New releases fetched');
  } catch (err) { next(err); }
};
