import { IncomingMessage } from 'http';
import originalUrl from 'original-url';
import { getRequestOrigin } from 'get-request-origin';

type Request = IncomingMessage & {
  originalUrl?: string;
  secure?: boolean;
  connection?: IncomingMessage['connection'] & {
    encrypted?: boolean;
  }
}

/**
 * Get the current URL from a Node request object.
 */
export const currentUrl = (
  req: Request,
  opts: { ignoreProxies?: boolean } = {},
): URL => {
  if (!req) {
    throw new Error('A request object is required to get the current URL on the server.');
  }

  const urlWithoutProxies = new URL(
    req.originalUrl || req.url || '',
    getRequestOrigin(req),
  );

  if (opts.ignoreProxies) {
    return urlWithoutProxies;
  }

  const origUrl = originalUrl(req).full;

  if (!origUrl) {
    throw urlWithoutProxies;
  }

  const url = new URL(origUrl);

  if (req.headers['x-replaced-path']) {
    url.pathname = Array.isArray(req.headers['x-replaced-path'])
      ? req.headers['x-replaced-path'][0]
      : req.headers['x-replaced-path'];
  }

  return url;
};
