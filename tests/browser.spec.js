import { getCurrentUrl } from '../src';

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
    const currentUrl = getCurrentUrl();

    expect(currentUrl).toBeInstanceOf(URL);
    expect(currentUrl.href).toBe('http://example.com/browser?foo=bar');
  });
});
