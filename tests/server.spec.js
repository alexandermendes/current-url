/**
 * @jest-environment node
 */
import express from 'express';
import fetch from 'node-fetch';
import { getCurrentUrl } from '../src';

let lastReq;
let server;

beforeAll((done) => {
  const app = express();

  app.get('*', (req, res) => {
    lastReq = req;
    res.sendStatus(200);
  });

  server = app.listen(done);
});

afterAll((done) => {
  server.close(done);
});

const getBaseUrl = () => `http://localhost:${server.address().port}`;

const createRequest = async (endpoint, opts) => {
  const url = new URL(endpoint || '/', getBaseUrl());

  await fetch(url.href, opts);

  return lastReq;
};

describe('Server', () => {
  it('returns the current URL', async () => {
    const endpoint = '/server?foo=bar';
    const req = await createRequest(endpoint);

    const currentUrl = getCurrentUrl(req);
    const { href: expectedUrl } = new URL(endpoint, getBaseUrl());

    expect(currentUrl).toBeInstanceOf(URL);
    expect(currentUrl.href).toBe(expectedUrl);
  });

  describe('proxies', () => {
    it('respects proxies by default', async () => {
      const endpoint = '/page';
      const req = await createRequest(endpoint, {
        headers: {
          'x-forwarded-protocol': 'https',
          'x-forwarded-host': 'original.com',
          'x-forwarded-port': '1234',
        },
      });

      const currentUrl = getCurrentUrl(req);
      const { href: expectedUrl } = new URL(endpoint, 'https://original.com:1234');

      expect(currentUrl).toBeInstanceOf(URL);
      expect(currentUrl.href).toBe(expectedUrl);
    });

    it('ignores proxies if the relevant option is set', async () => {
      const endpoint = '/page';
      const req = await createRequest(endpoint, {
        headers: {
          'x-forwarded-protocol': 'https',
          'x-forwarded-host': 'original.com',
          'x-forwarded-port': '1234',
        },
      });

      const currentUrl = getCurrentUrl(req, { ignoreProxies: true });
      const { href: expectedUrl } = new URL(endpoint, getBaseUrl());

      expect(currentUrl).toBeInstanceOf(URL);
      expect(currentUrl.href).toBe(expectedUrl);
    });
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
