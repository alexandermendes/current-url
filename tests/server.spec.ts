/**
 * @jest-environment node
 */
import express, { Request } from 'express';
import fetch from 'node-fetch';
import { currentUrl } from '../src/server';

let lastReq: Request;
let server: any;

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

const createRequest = async (endpoint: string, opts?: any) => {
  const url = new URL(endpoint || '/', getBaseUrl());

  await fetch(url.href, opts);

  return lastReq;
};

describe('Server', () => {
  it('returns the current URL', async () => {
    const endpoint = '/server?foo=bar';
    const req = await createRequest(endpoint);

    const actualUrl = currentUrl(req);
    const { href: expectedUrl } = new URL(endpoint, getBaseUrl());

    expect(actualUrl).toBeInstanceOf(URL);
    expect(actualUrl?.href).toBe(expectedUrl);
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

      const actualUrl = currentUrl(req);
      const { href: expectedUrl } = new URL(endpoint, 'https://original.com:1234');

      expect(actualUrl).toBeInstanceOf(URL);
      expect(actualUrl?.href).toBe(expectedUrl);
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

      const actualUrl = currentUrl(req, { ignoreProxies: true });
      const { href: expectedUrl } = new URL(endpoint, getBaseUrl());

      expect(actualUrl).toBeInstanceOf(URL);
      expect(actualUrl?.href).toBe(expectedUrl);
    });
  });

  describe('X-Replaced-Path', () => {
    it('respects replaced paths', async () => {
      const endpoint = '/rewritten/page';
      const originalEndpoint = '/original/page';
      const req = await createRequest(endpoint, {
        headers: {
          'x-replaced-path': originalEndpoint,
        },
      });

      const actualUrl = currentUrl(req);
      const { href: expectedUrl } = new URL(originalEndpoint, getBaseUrl());

      expect(actualUrl).toBeInstanceOf(URL);
      expect(actualUrl?.href).toBe(expectedUrl);
    });

    it('respects replaced paths with query params', async () => {
      const endpoint = '/rewritten/page?foo=bar';
      const originalEndpoint = '/original/page';
      const req = await createRequest(endpoint, {
        headers: {
          'x-replaced-path': originalEndpoint,
        },
      });

      const actualUrl = currentUrl(req);
      const { href: expectedUrl } = new URL(`${originalEndpoint}?foo=bar`, getBaseUrl());

      expect(actualUrl).toBeInstanceOf(URL);
      expect(actualUrl?.href).toBe(expectedUrl);
    });
  });
});
