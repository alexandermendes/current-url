import { IncomingMessage } from 'http';
import originalUrl from 'original-url';

const isIncomingMessage = (req) => (
  req.name === 'IncomingMessage'
  || req.constructor.name === 'IncomingMessage'
  || req instanceof IncomingMessage
);

export const getCurrentUrl = (req, opts = {}) => {
  if (!req) {
    throw new Error('A request object is required to get the current URL on the server.');
  }

  if (!isIncomingMessage(req)) {
    throw new Error('The request object must be an instance of `IncomingMessage`.');
  }

  if (opts.ignoreProxies) {
    return new URL(req.url);
  }

  return new URL(originalUrl(req).full);
};
