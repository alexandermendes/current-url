import { IncomingMessage } from 'http';
import originalUrl from 'original-url';
import { getRequestOrigin } from 'get-request-origin';

const isIncomingMessage = (req) => (
  req.name === 'IncomingMessage'
  || req.constructor.name === 'IncomingMessage'
  || req instanceof IncomingMessage
);

/**
 * Get the current URL from a Node request object.
 */
export const currentUrl = (req, opts = {}) => {
  if (!req) {
    throw new Error('A request object is required to get the current URL on the server.');
  }

  if (!isIncomingMessage(req)) {
    throw new Error('The request object must be an instance of `IncomingMessage`.');
  }

  if (opts.ignoreProxies) {
    return new URL(req.originalUrl || req.url, getRequestOrigin(req));
  }

  const url = new URL(originalUrl(req).full);

  if (req.headers['x-replaced-path']) {
    url.pathname = req.headers['x-replaced-path'];
  }

  return url;
};
