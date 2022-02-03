import { IncomingMessage } from 'http';
import originalUrl from 'original-url';

export const getCurrentUrl = (req, opts = {}) => {
  if (!req) {
    throw new Error('A request object is required to get the current URL on the server.');
  }

  if (!(req instanceof IncomingMessage)) {
    throw new Error('The request object must be an instance of `IncomingMessage`.');
  }

  if (opts.original) {
    return new URL(originalUrl(req).full);
  }

  return new URL(req.url);
};
