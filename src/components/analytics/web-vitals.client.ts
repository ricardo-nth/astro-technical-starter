import type { Metric } from 'web-vitals';

interface VitalsModule {
  trackWebVitals: (metric: Metric, config: { enabled: boolean; debug: boolean }) => void;
  initPerformanceMonitoring: () => void;
  checkPerformanceBudget: () => void;
  trackCustomMetric: (name: string, value: number) => void;
}

async function loadVitalsModule(): Promise<VitalsModule | null> {
  try {
    const module = await import('../../utils/vitals.js');
    return module;
  } catch (error) {
    console.warn('Failed to load vitals utilities:', error);
    return null;
  }
}

function registerNavigationTracking(config: { enabled: boolean; debug: boolean }) {
  let navigationStartTime = performance.now();

  document.addEventListener('astro:page-load', () => {
    const navigationTime = performance.now() - navigationStartTime;
    loadVitalsModule().then((module) => {
      if (module) {
        module.trackCustomMetric('astro-navigation', navigationTime);
      }
    });

    navigationStartTime = performance.now();
  });

  if (config.debug) {
    console.log('🚀 Web Vitals monitoring initialized');
  }
}

async function initWebVitals() {
  try {
    const { onFCP, onLCP, onCLS, onFID, onTTFB, onINP } = await import('web-vitals');
    const vitalsModule = await loadVitalsModule();

    if (!vitalsModule) return;

    const config = {
      enabled: true,
      debug: import.meta.env.DEV,
    };

    const track = (metric: Metric) => vitalsModule.trackWebVitals(metric, config);

    onFCP(track);
    onLCP(track);
    onCLS(track);
    onFID(track);
    onTTFB(track);

    if (onINP) {
      onINP(track);
    }

    vitalsModule.initPerformanceMonitoring();

    window.addEventListener('load', () => {
      window.setTimeout(vitalsModule.checkPerformanceBudget, 1000);
    });

    registerNavigationTracking(config);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('web-vitals library not available:', error);
    }
  }
}

initWebVitals();
