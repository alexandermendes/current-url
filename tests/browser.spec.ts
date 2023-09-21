/**
 * @jest-environment jsdom
 */
import { currentUrl } from '../src/browser';

describe('Browser', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        href: 'http://example.com/browser?foo=bar',
      },
    });
  });

  it('returns the current URL', () => {
    const actualUrl = currentUrl();

    expect(actualUrl).toBeInstanceOf(URL);
    expect(actualUrl.href).toBe('http://example.com/browser?foo=bar');
  });
});
