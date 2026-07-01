/**
 * @file services/playlists.service.js
 */

import cache from '../config/cache.js';
import provider from '../services/provider.js';
import normalizer from '../utils/normalizer.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';

export const getPlaylist = async (id, link, page = 1, limit = 50) => {
  if (!id && !link) throw new ValidationError("'id' or 'link' is required");
  const key = cache.buildKey('playlist', id || link, page, limit);
  return cache.remember(key, async () => {
    const raw = id
      ? await provider.getPlaylistById(id, page, limit)
      : await provider.getPlaylistByLink(link, page, limit);
    const playlist = normalizer.normalizePlaylist(raw);
    if (!playlist) throw new NotFoundError('Playlist not found');
    return playlist;
  });
};

export default { getPlaylist };
