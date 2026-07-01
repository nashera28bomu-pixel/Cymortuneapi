/**
 * @file utils/normalizer.js
 * @description Transforms raw JioSaavn provider responses into the Cymor Tune
 * API format. The frontend never sees provider-specific field names.
 * If the provider changes, only this file needs updating.
 */

/**
 * Pick the best quality download URL from the downloadUrl array.
 * JioSaavn returns multiple qualities: 12kbps, 48kbps, 96kbps, 160kbps, 320kbps
 */
const bestQuality = (downloadUrls = []) => {
  if (!Array.isArray(downloadUrls) || !downloadUrls.length) return null;
  const preferred = ['320kbps', '160kbps', '96kbps', '48kbps', '12kbps'];
  for (const q of preferred) {
    const found = downloadUrls.find((u) => u.quality === q);
    if (found?.url) return found.url;
  }
  return downloadUrls[downloadUrls.length - 1]?.url || null;
};

/** Pick highest quality image from array */
const bestImage = (images = []) => {
  if (!Array.isArray(images) || !images.length) return null;
  const preferred = ['500x500', '150x150', '50x50'];
  for (const q of preferred) {
    const found = images.find((i) => i.quality === q);
    if (found?.url) return found.url;
  }
  return images[0]?.url || null;
};

/** Normalize a single song */
export const normalizeSong = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id,
    title: raw.name || raw.title || 'Unknown',
    duration: raw.duration || 0,
    year: raw.year || null,
    language: raw.language || null,
    label: raw.label || null,
    explicit: raw.explicitContent || false,
    play_count: raw.playCount || null,
    image: bestImage(raw.image),
    stream_url: bestQuality(raw.downloadUrl),
    download_url: bestQuality(raw.downloadUrl),
    preview_url: raw.previewUrl || null,
    artists: {
      primary: (raw.artists?.primary || []).map((a) => ({
        id: a.id,
        name: a.name,
        image: bestImage(a.image),
      })),
      featured: (raw.artists?.featured || []).map((a) => ({
        id: a.id,
        name: a.name,
      })),
      all: (raw.artists?.all || []).map((a) => ({
        id: a.id,
        name: a.name,
        role: a.role || null,
      })),
    },
    album: raw.album
      ? {
          id: raw.album.id,
          name: raw.album.name,
          url: raw.album.url,
        }
      : null,
    has_lyrics: raw.hasLyrics || false,
    lyrics_id: raw.lyricsId || null,
  };
};

/** Normalize a list of songs */
export const normalizeSongs = (items = []) =>
  (items || []).map(normalizeSong).filter(Boolean);

/** Normalize an album */
export const normalizeAlbum = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name || 'Unknown Album',
    year: raw.year || null,
    type: raw.type || 'album',
    image: bestImage(raw.image),
    language: raw.language || null,
    song_count: raw.songCount || null,
    artists: (raw.artists?.primary || []).map((a) => ({
      id: a.id,
      name: a.name,
      image: bestImage(a.image),
    })),
    songs: normalizeSongs(raw.songs || []),
  };
};

/** Normalize an artist */
export const normalizeArtist = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name || 'Unknown Artist',
    image: bestImage(raw.image),
    follower_count: raw.followerCount || null,
    biography: raw.bio || null,
    available_languages: raw.availableLanguages || [],
    is_verified: raw.isVerified || false,
    top_songs: normalizeSongs(raw.topSongs || []),
    top_albums: (raw.topAlbums || []).map(normalizeAlbum).filter(Boolean),
    similar_artists: (raw.similarArtists || []).map((a) => ({
      id: a.id,
      name: a.name,
      image: bestImage(a.image),
    })),
  };
};

/** Normalize a playlist */
export const normalizePlaylist = (raw) => {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name || 'Unknown Playlist',
    description: raw.description || null,
    image: bestImage(raw.image),
    song_count: raw.songCount || null,
    language: raw.language || null,
    fan_count: raw.fanCount || null,
    songs: normalizeSongs(raw.songs || []),
  };
};

/** Normalize search results (multi-type) */
export const normalizeSearchResults = (raw) => {
  if (!raw) return {};
  return {
    songs: {
      total: raw.songs?.total || 0,
      items: normalizeSongs(raw.songs?.results || []),
    },
    albums: {
      total: raw.albums?.total || 0,
      items: (raw.albums?.results || []).map(normalizeAlbum).filter(Boolean),
    },
    artists: {
      total: raw.artists?.total || 0,
      items: (raw.artists?.results || []).map((a) => ({
        id: a.id,
        name: a.name,
        image: bestImage(a.image),
        follower_count: a.followerCount || null,
      })),
    },
    playlists: {
      total: raw.playlists?.total || 0,
      items: (raw.playlists?.results || []).map(normalizePlaylist).filter(Boolean),
    },
  };
};

export default {
  normalizeSong,
  normalizeSongs,
  normalizeAlbum,
  normalizeArtist,
  normalizePlaylist,
  normalizeSearchResults,
};
