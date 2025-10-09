function inspectSchemas() {
  const schemas = document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]');
  console.group('🔍 Schema.org Validation');

  schemas.forEach((script, index) => {
    try {
      const data = JSON.parse(script.innerHTML);
      const type = script.getAttribute('data-schema-type');
      console.log(`✅ Schema ${index + 1} (${type ?? 'unknown'}):`, data);

      if (!data['@context']) {
        console.warn(`⚠️ Schema ${index + 1}: Missing @context`);
      }
      if (!data['@type']) {
        console.warn(`⚠️ Schema ${index + 1}: Missing @type`);
      }
    } catch (error) {
      console.error(`❌ Schema ${index + 1}: Invalid JSON`, error);
    }
  });

  console.groupEnd();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inspectSchemas);
} else {
  inspectSchemas();
}
