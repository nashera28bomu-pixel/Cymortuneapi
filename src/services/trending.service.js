/**
 * @file services/trending.service.js
 */

import cache from '../config/cache.js';
import provider from '../services/provider.js';
import normalizer from '../utils/normalizer.js';

export const getTrending = async () => {
  return cache.remember(cache.buildKey('trending:all'), async () => {
    const [charts, english, newRel] = await Promise.allSettled([
      provider.getTopCharts(),
      provider.getTopEnglish(),
      provider.getNewReleases(),
    ]);

    return {
      charts: charts.status === 'fulfilled'
        ? normalizer.normalizeSongs(charts.value?.songs || []).slice(0, 20)
        : [],
      english: english.status === 'fulfilled'
        ? normalizer.normalizeSongs(english.value?.songs || []).slice(0, 20)
        : [],
      new_releases: newRel.status === 'fulfilled'
        ? normalizer.normalizeSongs(newRel.value?.results || []).slice(0, 20)
        : [],
    };
  }, 900); // 15 min TTL for trending
};

export const getCharts = async () => {
  return cache.remember(cache.buildKey('trending:charts'), async () => {
    const raw = await provider.getTopCharts();
    return {
      name: raw.name || 'Top Charts',
      songs: normalizer.normalizeSongs(raw.songs || []),
    };
  }, 900);
};

export const getNewReleases = async () => {
  return cache.remember(cache.buildKey('trending:new'), async () => {
    const raw = await provider.getNewReleases();
    return normalizer.normalizeSongs(raw.results || []);
  }, 900);
};

export default { getTrending, getCharts, getNewReleases };
