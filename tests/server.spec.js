/**
 * @jest-environment node
 */
import { IncomingMessage } from 'http';

import { getCurrentUrl } from '../src';

describe('Server', () => {
  it('returns the current URL', () => {
    const req = new IncomingMessage();

    req.url = 'http://example.com/server?foo=bar';

    const currentUrl = getCurrentUrl(req);

    expect(currentUrl).toBeInstanceOf(URL);
    expect(currentUrl.href).toBe('http://example.com/server?foo=bar');
  });

  it('respects proxies', () => {
    const req = new IncomingMessage();

    req.headers = {
      'x-forwarded-protocol': 'https',
      'x-forwarded-host': 'original.com',
      'x-forwarded-port': '1234',
    };

    const currentUrl = getCurrentUrl(req, { original: true });

    expect(currentUrl).toBeInstanceOf(URL);
    expect(currentUrl.href).toBe('https://original.com:1234/');
  });

  it('throws if no request object is given', () => {
    expect(() => getCurrentUrl()).toThrow(
      'A request object is required to get the current URL on the server.',
    );
  });

  it('throws if an invalid request object is given', () => {
    expect(() => getCurrentUrl({})).toThrow(
      'The request object must be an instance of `IncomingMessage`.',
    );
  });
});
