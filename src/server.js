import { IncomingMessage } from 'http';
import originalUrl from 'original-url';
import { parse as parseUrl } from 'url';

const isIncomingMessage = (req) => (
  req.name === 'IncomingMessage'
  || req.constructor.name === 'IncomingMessage'
  || req instanceof IncomingMessage
);

const parseHostHeader = (req) => {
  const { host } = req.headers;

  if (typeof host !== 'string') {
    return {};
  }

  const { protocol: urlProtocol } = parseUrl(req.originalUrl || req.url || '');
  const secure = req.secure || (req.connection && req.connection.encrypted);
  const protocolPattern = /^(?:[a-z]+:)?\/\//i;
  const hostProtocol = protocolPattern.test(host) ? host.match(protocolPattern)[0] : null;
  const fallbackProtocol = secure ? 'https:' : 'http:';
  const protocol = urlProtocol || hostProtocol || fallbackProtocol;

  return parseUrl(hostProtocol ? host : `${protocol}//${host}`);
};

export const currentUrl = (req, opts = {}) => {
  if (!req) {
    throw new Error('A request object is required to get the current URL on the server.');
  }

  if (!isIncomingMessage(req)) {
    throw new Error('The request object must be an instance of `IncomingMessage`.');
  }

  if (!opts.ignoreProxies) {
    return new URL(originalUrl(req).full);
  }

  const { protocol, hostname, port } = parseHostHeader(req);
  const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}`;

  return new URL(req.originalUrl || req.url, baseUrl);
};
