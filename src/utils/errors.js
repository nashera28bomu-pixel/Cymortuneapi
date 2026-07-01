/**
 * @file utils/errors.js
 * @description Custom error classes used throughout the app for consistent,
 * predictable error handling. Services throw these; the global error
 * middleware turns them into clean JSON responses.
 */

export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  constructor(message, details = null) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ProviderError extends ApiError {
  constructor(message = 'Music provider is temporarily unavailable') {
    super(502, message);
    this.name = 'ProviderError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request to music provider timed out') {
    super(504, message);
    this.name = 'TimeoutError';
  }
}
