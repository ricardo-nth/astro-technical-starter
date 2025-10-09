/**
 * Schema.org utilities for generating structured data
 * Provides comprehensive schema generation for technical SEO
 */

import type {
  AnySchema,
  OrganizationSchema,
  PersonSchema,
  WebSiteSchema,
  WebPageSchema,
  ArticleSchema,
  ServiceSchema,
  FAQPageSchema,
  ProductSchema,
  LocalBusinessSchema,
  BreadcrumbList,
  SchemaConfig,
  SearchAction,
  Question,
  ImageObject
} from '../types/schema';

/**
 * Base schema context
 */
const SCHEMA_CONTEXT = 'https://schema.org';

/**
 * Default schema configuration
 */
export const defaultSchemaConfig: SchemaConfig = {
  breadcrumbs: true,
  enableLocalBusiness: false,
  enableFAQ: true,
  enableReviews: true,
};

/**
 * Create base schema with context
 */
export function createBaseSchema<T extends AnySchema>(type: string, data: Omit<T, '@context' | '@type'>): T {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': type,
    ...data,
  } as T;
}

/**
 * Generate Organization schema
 */
export function createOrganizationSchema(data: Partial<OrganizationSchema>): OrganizationSchema {
  return createBaseSchema<OrganizationSchema>('Organization', {
    name: data.name || 'Your Company',
    url: data.url || 'https://yourwebsite.com',
    logo: data.logo,
    address: data.address,
    contactPoint: data.contactPoint,
    sameAs: data.sameAs || [],
    description: data.description,
    email: data.email,
    telephone: data.telephone,
    foundingDate: data.foundingDate,
    numberOfEmployees: data.numberOfEmployees,
    areaServed: data.areaServed,
    '@id': data['@id'] || `${data.url || 'https://yourwebsite.com'}#organization`,
  });
}

/**
 * Generate Person schema
 */
export function createPersonSchema(data: Partial<PersonSchema>): PersonSchema {
  return createBaseSchema<PersonSchema>('Person', {
    name: data.name || 'Author Name',
    url: data.url,
    image: data.image,
    jobTitle: data.jobTitle,
    worksFor: data.worksFor,
    sameAs: data.sameAs || [],
    email: data.email,
    telephone: data.telephone,
    address: data.address,
    '@id': data['@id'] || `${data.url || '#person'}`,
  });
}

/**
 * Generate Website schema
 */
export function createWebSiteSchema(data: Partial<WebSiteSchema>): WebSiteSchema {
  const searchAction: SearchAction = {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${data.url || 'https://yourwebsite.com'}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  };

  return createBaseSchema<WebSiteSchema>('WebSite', {
    name: data.name || 'Your Website',
    url: data.url || 'https://yourwebsite.com',
    description: data.description,
    publisher: data.publisher,
    potentialAction: data.potentialAction || searchAction,
    inLanguage: data.inLanguage || 'en-US',
    copyrightYear: data.copyrightYear || new Date().getFullYear(),
    copyrightHolder: data.copyrightHolder,
    '@id': data['@id'] || `${data.url || 'https://yourwebsite.com'}#website`,
  });
}

/**
 * Generate WebPage schema
 */
export function createWebPageSchema(
  data: Partial<WebPageSchema>,
  config: SchemaConfig = defaultSchemaConfig
): WebPageSchema {
  return createBaseSchema<WebPageSchema>(data['@type'] || 'WebPage', {
    name: data.name || 'Page Title',
    url: data.url || 'https://yourwebsite.com',
    description: data.description,
    isPartOf: data.isPartOf,
    author: data.author,
    publisher: data.publisher,
    datePublished: data.datePublished,
    dateModified: data.dateModified || data.datePublished,
    inLanguage: data.inLanguage || 'en-US',
    breadcrumb: config.breadcrumbs && data.breadcrumb ? data.breadcrumb : undefined,
    mainEntity: data.mainEntity,
    speakable: data.speakable,
    '@id': data['@id'] || data.url,
  });
}

/**
 * Generate Article schema
 */
export function createArticleSchema(data: Partial<ArticleSchema>): ArticleSchema {
  // Convert string images to ImageObject
  let imageObjects: ImageObject[] | undefined;
  if (data.image) {
    if (typeof data.image === 'string') {
      imageObjects = [{
        '@type': 'ImageObject',
        url: data.image,
      }];
    } else {
      imageObjects = data.image;
    }
  }

  return createBaseSchema<ArticleSchema>(data['@type'] || 'Article', {
    headline: data.headline || 'Article Title',
    description: data.description,
    image: imageObjects,
    author: data.author,
    publisher: data.publisher,
    datePublished: data.datePublished || new Date().toISOString(),
    dateModified: data.dateModified || data.datePublished || new Date().toISOString(),
    url: data.url || 'https://yourwebsite.com',
    mainEntityOfPage: data.mainEntityOfPage || data.url,
    articleSection: data.articleSection,
    wordCount: data.wordCount,
    keywords: data.keywords || [],
    inLanguage: data.inLanguage || 'en-US',
    '@id': data['@id'] || data.url,
  });
}

/**
 * Generate Service schema
 */
export function createServiceSchema(data: Partial<ServiceSchema>): ServiceSchema {
  return createBaseSchema<ServiceSchema>('Service', {
    name: data.name || 'Service Name',
    description: data.description || 'Service description',
    provider: data.provider || createOrganizationSchema({}),
    areaServed: data.areaServed,
    serviceType: data.serviceType,
    offers: data.offers || [],
    url: data.url,
    image: data.image,
    category: data.category,
    '@id': data['@id'] || `${data.url || '#service'}`,
  });
}

/**
 * Generate FAQ schema
 */
export function createFAQSchema(questions: Array<{ question: string; answer: string }>): FAQPageSchema {
  const questionEntities: Question[] = questions.map((item, index) => ({
    '@type': 'Question',
    '@context': SCHEMA_CONTEXT,
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      '@context': SCHEMA_CONTEXT,
      text: item.answer,
    },
    '@id': `#question-${index + 1}`,
  }));

  return createBaseSchema<FAQPageSchema>('FAQPage', {
    mainEntity: questionEntities,
    '@id': '#faq',
  });
}

/**
 * Generate Product schema
 */
export function createProductSchema(data: Partial<ProductSchema>): ProductSchema {
  // Convert string images to ImageObject
  let imageObjects: ImageObject[] | undefined;
  if (data.image) {
    if (typeof data.image === 'string') {
      imageObjects = [{
        '@type': 'ImageObject',
        url: data.image,
      }];
    } else {
      imageObjects = data.image;
    }
  }

  return createBaseSchema<ProductSchema>(data['@type'] || 'Product', {
    name: data.name || 'Product Name',
    description: data.description || 'Product description',
    image: imageObjects,
    brand: data.brand,
    manufacturer: data.manufacturer,
    offers: data.offers || [],
    aggregateRating: data.aggregateRating,
    review: data.review || [],
    sku: data.sku,
    mpn: data.mpn,
    gtin: data.gtin,
    category: data.category,
    url: data.url,
    '@id': data['@id'] || `${data.url || '#product'}`,
  });
}

/**
 * Generate Local Business schema
 */
export function createLocalBusinessSchema(data: Partial<LocalBusinessSchema>): LocalBusinessSchema {
  return createBaseSchema<LocalBusinessSchema>(data['@type'] || 'LocalBusiness', {
    name: data.name || 'Business Name',
    address: data.address || {
      '@type': 'PostalAddress',
      streetAddress: '123 Main St',
      addressLocality: 'City',
      addressRegion: 'State',
      postalCode: '12345',
      addressCountry: 'US',
    },
    telephone: data.telephone || '+1-555-555-5555',
    url: data.url || 'https://yourwebsite.com',
    image: data.image,
    description: data.description,
    openingHours: data.openingHours || [],
    priceRange: data.priceRange,
    servesCuisine: data.servesCuisine,
    paymentAccepted: data.paymentAccepted,
    currenciesAccepted: data.currenciesAccepted,
    geo: data.geo,
    aggregateRating: data.aggregateRating,
    review: data.review || [],
    '@id': data['@id'] || `${data.url || 'https://yourwebsite.com'}#business`,
  });
}

/**
 * Generate Breadcrumb schema
 */
export function createBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbList {
  const listItems = items.map((item, index) => ({
    '@type': 'ListItem' as const,
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return {
    '@type': 'BreadcrumbList',
    itemListElement: listItems,
  };
}

/**
 * Generate comprehensive page schema
 */
export function generatePageSchema(
  pageData: {
    type: 'webpage' | 'article' | 'service' | 'product' | 'faq' | 'about' | 'contact';
    title: string;
    description: string;
    url: string;
    image?: string;
    author?: Partial<PersonSchema>;
    datePublished?: string;
    dateModified?: string;
    breadcrumbs?: Array<{ name: string; url?: string }>;
    faqs?: Array<{ question: string; answer: string }>;
    services?: Array<Partial<ServiceSchema>>;
    products?: Array<Partial<ProductSchema>>;
  },
  siteConfig: {
    organization: Partial<OrganizationSchema>;
    website: Partial<WebSiteSchema>;
    defaultAuthor?: Partial<PersonSchema>;
  }
): AnySchema[] {
  const schemas: AnySchema[] = [];

  // Always include organization
  schemas.push(createOrganizationSchema(siteConfig.organization));

  // Always include website
  schemas.push(createWebSiteSchema(siteConfig.website));

  // Add page-specific schema
  switch (pageData.type) {
    case 'article':
      schemas.push(createArticleSchema({
        headline: pageData.title,
        description: pageData.description,
        url: pageData.url,
        image: pageData.image,
        author: pageData.author ? createPersonSchema(pageData.author) : siteConfig.defaultAuthor ? createPersonSchema(siteConfig.defaultAuthor) : undefined,
        publisher: createOrganizationSchema(siteConfig.organization),
        datePublished: pageData.datePublished,
        dateModified: pageData.dateModified,
      }));
      break;

    case 'service':
      if (pageData.services) {
        pageData.services.forEach(service => {
          schemas.push(createServiceSchema({
            ...service,
            provider: createOrganizationSchema(siteConfig.organization),
          }));
        });
      }
      break;

    case 'product':
      if (pageData.products) {
        pageData.products.forEach(product => {
          schemas.push(createProductSchema({
            ...product,
            brand: createOrganizationSchema(siteConfig.organization),
          }));
        });
      }
      break;

    case 'faq':
      if (pageData.faqs) {
        schemas.push(createFAQSchema(pageData.faqs));
      }
      break;

    default:
      // Default WebPage schema
      let pageType: 'WebPage' | 'AboutPage' | 'ContactPage' = 'WebPage';
      if (pageData.type === 'about') pageType = 'AboutPage';
      if (pageData.type === 'contact') pageType = 'ContactPage';

      schemas.push(createWebPageSchema({
        '@type': pageType,
        name: pageData.title,
        description: pageData.description,
        url: pageData.url,
        isPartOf: createWebSiteSchema(siteConfig.website),
        author: pageData.author ? createPersonSchema(pageData.author) : siteConfig.defaultAuthor ? createPersonSchema(siteConfig.defaultAuthor) : undefined,
        publisher: createOrganizationSchema(siteConfig.organization),
        datePublished: pageData.datePublished,
        dateModified: pageData.dateModified,
        breadcrumb: pageData.breadcrumbs ? createBreadcrumbSchema(pageData.breadcrumbs) : undefined,
      }));
  }

  // Add breadcrumbs if provided
  if (pageData.breadcrumbs && pageData.breadcrumbs.length > 1) {
    schemas.push(createBreadcrumbSchema(pageData.breadcrumbs));
  }

  return schemas;
}

/**
 * Validate schema data
 */
export function validateSchema(schema: AnySchema): boolean {
  try {
    const schemaAny = schema as any;
    
    // Basic validation
    if (!schemaAny['@context'] || !schemaAny['@type']) {
      return false;
    }

    // Type-specific validation
    switch (schemaAny['@type']) {
      case 'Organization':
        return !!(schema as OrganizationSchema).name && !!(schema as OrganizationSchema).url;
      case 'Person':
        return !!(schema as PersonSchema).name;
      case 'WebSite':
        return !!(schema as WebSiteSchema).name && !!(schema as WebSiteSchema).url;
      case 'WebPage':
      case 'AboutPage':
      case 'ContactPage':
        return !!(schema as WebPageSchema).name && !!(schema as WebPageSchema).url;
      case 'Article':
      case 'BlogPosting':
      case 'NewsArticle':
        return !!(schema as ArticleSchema).headline && !!(schema as ArticleSchema).datePublished;
      default:
        return true;
    }
  } catch {
    return false;
  }
}

/**
 * Clean schema data (remove undefined/null values)
 */
export function cleanSchema<T extends AnySchema>(schema: T): T {
  const cleaned = JSON.parse(JSON.stringify(schema, (_, value) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (Array.isArray(value) && value.length === 0) {
      return undefined;
    }
    return value;
  }));

  return cleaned;
}
