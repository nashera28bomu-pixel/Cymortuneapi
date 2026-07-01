/**
 * @file utils/response.js
 * @description Centralized HTTP response helpers.
 * Every response from this API follows one consistent envelope.
 *
 * Success: { success, message, data, meta }
 * Failure: { success, message, error }
 */

export const success = (res, data, message = 'Success', meta = {}, statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data, meta });

export const error = (res, message, statusCode = 500, err = null) => {
  const body = { success: false, message };
  if (err && !process.env.NODE_ENV?.includes('prod')) {
    body.error = { type: err.name || 'Error', details: err.details || null };
  }
  return res.status(statusCode).json(body);
};

export default { success, error };
