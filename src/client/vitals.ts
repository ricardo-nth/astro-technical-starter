/**
 * Client-side Web Vitals tracking entry point
 * Loads and initializes Core Web Vitals monitoring
 */

import { onFCP, onLCP, onCLS, onTTFB, onINP } from 'web-vitals';
import { trackWebVitals, initPerformanceMonitoring, checkPerformanceBudget, trackCustomMetric } from '../utils/vitals.js';

// Configure analytics
const config = {
  enabled: true,
  debug: import.meta.env.DEV, // Enable debug in development
};

// Track all Core Web Vitals
onFCP((metric) => trackWebVitals(metric, config));
onLCP((metric) => trackWebVitals(metric, config));
onCLS((metric) => trackWebVitals(metric, config));
// Note: FID is deprecated in web-vitals v4+, replaced by INP
onTTFB((metric) => trackWebVitals(metric, config));

// Track INP (Interaction to Next Paint) if available
if (onINP) {
  onINP((metric) => trackWebVitals(metric, config));
}

// Initialize additional performance monitoring
initPerformanceMonitoring();

// Check performance budgets after page load
window.addEventListener('load', () => {
  setTimeout(checkPerformanceBudget, 1000);
});

// Track page navigation performance for SPAs
let navigationStartTime = performance.now();

// Listen for Astro view transitions if available
document.addEventListener('astro:page-load', () => {
  const navigationTime = performance.now() - navigationStartTime;
  trackCustomMetric('astro-navigation', navigationTime);
  navigationStartTime = performance.now();
});

if (config.debug) {
  console.log('🚀 Web Vitals monitoring initialized');
}