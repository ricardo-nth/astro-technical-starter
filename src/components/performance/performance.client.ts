function initPrefetchStrategy() {
  const prefetchOnHover = (link: HTMLAnchorElement) => {
    if (link.hostname !== window.location.hostname) return;
    if (link.dataset.prefetched) return;

    const linkElement = document.createElement('link');
    linkElement.rel = 'prefetch';
    linkElement.href = link.href;
    document.head.appendChild(linkElement);
    link.dataset.prefetched = 'true';
  };

  document.addEventListener(
    'mouseover',
    (event) => {
      const target = event.target as HTMLElement | null;
      if (target && target.tagName === 'A') {
        const anchor = target as HTMLAnchorElement;
        if (anchor.href) {
          prefetchOnHover(anchor);
        }
      }
    },
    { passive: true }
  );

  if ('IntersectionObserver' in window) {
    const linkObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const link = entry.target as HTMLAnchorElement;
            prefetchOnHover(link);
            linkObserver.unobserve(link);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    const observeLinks = () => {
      document
        .querySelectorAll<HTMLAnchorElement>('a[href^="/"], a[href^="./"], a[href^="../"]')
        .forEach((link) => {
          linkObserver.observe(link);
        });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeLinks);
    } else {
      observeLinks();
    }
  }
}

function optimizeFontLoading() {
  if ('fonts' in document) {
    const fonts = [
      new FontFace(
        'Inter',
        'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff2)',
        {
          display: 'swap',
          unicodeRange:
            'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
        }
      ),
    ];

    fonts.forEach((font) => {
      font
        .load()
        .then(() => {
          document.fonts.add(font);
        })
        .catch(() => {
          // ignore
        });
    });
  }
}

function loadCriticalResources() {
  const criticalImages: string[] = [];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

function reduceLayoutShift() {
  const images = document.querySelectorAll<HTMLImageElement>('img:not([width]):not([height])');
  images.forEach((img) => {
    if (!img.style.aspectRatio && !img.style.height) {
      img.style.aspectRatio = '16/9';
    }
  });
}

function initPerformanceMonitoring() {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', `${entry.duration}ms`);
          }
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
    } catch {
      // ignore unsupported browsers
    }
  }
}

function runOptimizations() {
  initPrefetchStrategy();
  optimizeFontLoading();
  loadCriticalResources();
  reduceLayoutShift();
  initPerformanceMonitoring();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runOptimizations);
} else {
  runOptimizations();
}
