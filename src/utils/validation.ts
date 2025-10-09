/**
 * Content validation utilities for quality assurance
 * Provides comprehensive validation for content collections and SEO data
 */

import type { AnySchema } from '@/types/schema';

// Validation severity levels
export type ValidationLevel = 'error' | 'warning' | 'info';

// Validation result interface
export interface ValidationResult {
  valid: boolean;
  level: ValidationLevel;
  field: string;
  message: string;
  suggestion?: string;
}

// Content quality rules
export interface ContentQualityRules {
  // SEO rules
  titleMinLength: number;
  titleMaxLength: number;
  descriptionMinLength: number;
  descriptionMaxLength: number;
  keywordMaxCount: number;
  
  // Content rules
  minContentLength: number;
  maxContentLength: number;
  
  // Schema rules
  requireSchema: boolean;
  requiredSchemaTypes: string[];
}

// Default quality rules
export const defaultQualityRules: ContentQualityRules = {
  titleMinLength: 30,
  titleMaxLength: 60,
  descriptionMinLength: 120,
  descriptionMaxLength: 160,
  keywordMaxCount: 10,
  minContentLength: 300,
  maxContentLength: 10000,
  requireSchema: true,
  requiredSchemaTypes: ['Organization', 'WebSite'],
};

/**
 * Validate SEO metadata
 */
export function validateSEOData(
  data: any,
  rules: ContentQualityRules = defaultQualityRules
): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Title validation
  if (!data.title) {
    results.push({
      valid: false,
      level: 'error',
      field: 'title',
      message: 'Title is required',
      suggestion: 'Add a descriptive title for better SEO',
    });
  } else {
    if (data.title.length < rules.titleMinLength) {
      results.push({
        valid: false,
        level: 'warning',
        field: 'title',
        message: `Title too short (${data.title.length} chars). Recommended: ${rules.titleMinLength}+ characters`,
        suggestion: 'Expand title with relevant keywords and descriptive text',
      });
    }
    
    if (data.title.length > rules.titleMaxLength) {
      results.push({
        valid: false,
        level: 'warning',
        field: 'title',
        message: `Title too long (${data.title.length} chars). Recommended: ${rules.titleMaxLength} characters maximum`,
        suggestion: 'Shorten title while keeping key information',
      });
    }
  }

  // Description validation
  if (!data.description) {
    results.push({
      valid: false,
      level: 'error',
      field: 'description',
      message: 'Meta description is required',
      suggestion: 'Add a compelling meta description to improve CTR',
    });
  } else {
    if (data.description.length < rules.descriptionMinLength) {
      results.push({
        valid: false,
        level: 'warning',
        field: 'description',
        message: `Description too short (${data.description.length} chars). Recommended: ${rules.descriptionMinLength}+ characters`,
        suggestion: 'Expand description with benefits and key information',
      });
    }
    
    if (data.description.length > rules.descriptionMaxLength) {
      results.push({
        valid: false,
        level: 'warning',
        field: 'description',
        message: `Description too long (${data.description.length} chars). Recommended: ${rules.descriptionMaxLength} characters maximum`,
        suggestion: 'Shorten description while keeping compelling information',
      });
    }
  }

  // Keywords validation
  if (data.keywords && Array.isArray(data.keywords)) {
    if (data.keywords.length > rules.keywordMaxCount) {
      results.push({
        valid: false,
        level: 'warning',
        field: 'keywords',
        message: `Too many keywords (${data.keywords.length}). Recommended: ${rules.keywordMaxCount} maximum`,
        suggestion: 'Focus on most relevant keywords for better targeting',
      });
    }

    // Check for duplicate keywords
    const duplicates = data.keywords.filter((item: string, index: number) => 
      data.keywords.indexOf(item) !== index
    );
    if (duplicates.length > 0) {
      results.push({
        valid: false,
        level: 'warning',
        field: 'keywords',
        message: `Duplicate keywords found: ${duplicates.join(', ')}`,
        suggestion: 'Remove duplicate keywords to improve keyword focus',
      });
    }
  }

  // Robots validation
  if (data.robots) {
    const validRobots = ['index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex'];
    const robotsDirectives = data.robots.split(',').map((r: string) => r.trim());
    
    robotsDirectives.forEach((directive: string) => {
      if (!validRobots.includes(directive)) {
        results.push({
          valid: false,
          level: 'error',
          field: 'robots',
          message: `Invalid robots directive: ${directive}`,
          suggestion: `Use valid directives: ${validRobots.join(', ')}`,
        });
      }
    });
  }

  return results;
}

/**
 * Validate schema markup
 */
export function validateSchema(
  schemas: AnySchema[],
  rules: ContentQualityRules = defaultQualityRules
): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (rules.requireSchema && schemas.length === 0) {
    results.push({
      valid: false,
      level: 'error',
      field: 'schema',
      message: 'Schema markup is required but not found',
      suggestion: 'Add structured data to improve search engine understanding',
    });
  }

  // Check for required schema types
  const schemaTypes = schemas.map(schema => schema['@type']);
  const requiredSchemaTypes = rules.requiredSchemaTypes || [];
  requiredSchemaTypes.forEach(requiredType => {
    if (!schemaTypes.includes(requiredType as any)) {
      results.push({
        valid: false,
        level: 'warning',
        field: 'schema',
        message: `Missing required schema type: ${requiredType}`,
        suggestion: `Add ${requiredType} schema for better SEO`,
      });
    }
  });

  // Validate individual schemas
  schemas.forEach((schema, index) => {
    const schemaAny = schema as any;
    
    if (!schemaAny['@context']) {
      results.push({
        valid: false,
        level: 'error',
        field: `schema[${index}]`,
        message: 'Schema missing @context',
        suggestion: 'Add @context to schema for proper structured data',
      });
    }

    if (!schemaAny['@type']) {
      results.push({
        valid: false,
        level: 'error',
        field: `schema[${index}]`,
        message: 'Schema missing @type',
        suggestion: 'Add @type to schema for proper classification',
      });
    }

    // Type-specific validation
    switch (schemaAny['@type']) {
      case 'Organization':
        if (!schemaAny.name) {
          results.push({
            valid: false,
            level: 'error',
            field: `schema[${index}].name`,
            message: 'Organization schema missing name',
            suggestion: 'Add organization name for proper identification',
          });
        }
        break;

      case 'WebSite':
        if (!schemaAny.url) {
          results.push({
            valid: false,
            level: 'error',
            field: `schema[${index}].url`,
            message: 'WebSite schema missing URL',
            suggestion: 'Add website URL for proper identification',
          });
        }
        break;

      case 'Article':
      case 'BlogPosting':
        if (!schemaAny.headline) {
          results.push({
            valid: false,
            level: 'error',
            field: `schema[${index}].headline`,
            message: 'Article schema missing headline',
            suggestion: 'Add article headline for proper content identification',
          });
        }
        if (!schemaAny.datePublished) {
          results.push({
            valid: false,
            level: 'warning',
            field: `schema[${index}].datePublished`,
            message: 'Article schema missing publication date',
            suggestion: 'Add publication date for better content freshness signals',
          });
        }
        break;
    }
  });

  return results;
}

/**
 * Validate content quality
 */
export function validateContent(
  content: string,
  rules: ContentQualityRules = defaultQualityRules
): ValidationResult[] {
  const results: ValidationResult[] = [];

  if (!content || content.trim().length === 0) {
    results.push({
      valid: false,
      level: 'error',
      field: 'content',
      message: 'Content is empty',
      suggestion: 'Add meaningful content for better user experience and SEO',
    });
    return results;
  }

  const wordCount = content.trim().split(/\s+/).length;
  const charCount = content.length;

  // Length validation
  if (charCount < rules.minContentLength) {
    results.push({
      valid: false,
      level: 'warning',
      field: 'content',
      message: `Content too short (${charCount} chars, ~${wordCount} words). Recommended: ${rules.minContentLength}+ characters`,
      suggestion: 'Add more detailed, valuable content for better SEO and user experience',
    });
  }

  if (charCount > rules.maxContentLength) {
    results.push({
      valid: false,
      level: 'info',
      field: 'content',
      message: `Content very long (${charCount} chars, ~${wordCount} words). Consider: ${rules.maxContentLength} characters maximum`,
      suggestion: 'Consider breaking into multiple pages or sections for better readability',
    });
  }

  // Basic content quality checks
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = wordCount / sentences.length;

  if (avgSentenceLength > 25) {
    results.push({
      valid: false,
      level: 'info',
      field: 'content',
      message: `Long average sentence length (${avgSentenceLength.toFixed(1)} words). Consider shorter sentences for readability`,
      suggestion: 'Break long sentences into shorter ones for better readability',
    });
  }

  // Check for common SEO issues
  const hasHeadings = /<h[1-6]/.test(content);
  if (!hasHeadings) {
    results.push({
      valid: false,
      level: 'warning',
      field: 'content',
      message: 'No headings found in content',
      suggestion: 'Add headings (H1, H2, etc.) to improve content structure and SEO',
    });
  }

  return results;
}

/**
 * Validate image optimization
 */
export function validateImages(content: string): ValidationResult[] {
  const results: ValidationResult[] = [];
  const imgRegex = /<img[^>]*>/gi;
  const images = content.match(imgRegex) || [];

  images.forEach((img, index) => {
    // Check for alt text
    if (!img.includes('alt=')) {
      results.push({
        valid: false,
        level: 'error',
        field: `image[${index}]`,
        message: 'Image missing alt text',
        suggestion: 'Add descriptive alt text for accessibility and SEO',
      });
    } else {
      const altMatch = img.match(/alt="([^"]*)"/);
      if (altMatch && altMatch[1].trim().length === 0) {
        results.push({
          valid: false,
          level: 'error',
          field: `image[${index}]`,
          message: 'Image has empty alt text',
          suggestion: 'Add descriptive alt text content',
        });
      }
    }

    // Check for loading optimization
    if (!img.includes('loading=')) {
      results.push({
        valid: false,
        level: 'warning',
        field: `image[${index}]`,
        message: 'Image missing loading attribute',
        suggestion: 'Add loading="lazy" for performance optimization',
      });
    }

    // Check for width/height attributes
    if (!img.includes('width=') || !img.includes('height=')) {
      results.push({
        valid: false,
        level: 'info',
        field: `image[${index}]`,
        message: 'Image missing width/height attributes',
        suggestion: 'Add width and height to prevent layout shift',
      });
    }
  });

  return results;
}

/**
 * Comprehensive validation for a page
 */
export function validatePage(pageData: {
  seo?: any;
  content?: string;
  schemas?: AnySchema[];
}, rules: ContentQualityRules = defaultQualityRules): ValidationResult[] {
  const allResults: ValidationResult[] = [];

  // Validate SEO data
  if (pageData.seo) {
    allResults.push(...validateSEOData(pageData.seo, rules));
  }

  // Validate content
  if (pageData.content) {
    allResults.push(...validateContent(pageData.content, rules));
    allResults.push(...validateImages(pageData.content));
  }

  // Validate schemas
  if (pageData.schemas) {
    allResults.push(...validateSchema(pageData.schemas, rules));
  }

  return allResults;
}

/**
 * Generate validation report
 */
export function generateValidationReport(results: ValidationResult[]): {
  summary: {
    total: number;
    errors: number;
    warnings: number;
    info: number;
    valid: boolean;
  };
  results: ValidationResult[];
} {
  const errors = results.filter(r => r.level === 'error');
  const warnings = results.filter(r => r.level === 'warning');
  const info = results.filter(r => r.level === 'info');

  return {
    summary: {
      total: results.length,
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
      valid: errors.length === 0,
    },
    results,
  };
}

/**
 * Format validation report for console output
 */
export function formatValidationReport(report: ReturnType<typeof generateValidationReport>): string {
  const { summary, results } = report;
  
  let output = `\n📊 Content Validation Report\n`;
  output += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  output += `Summary: ${summary.total} issues found\n`;
  output += `  ❌ Errors: ${summary.errors}\n`;
  output += `  ⚠️  Warnings: ${summary.warnings}\n`;
  output += `  ℹ️  Info: ${summary.info}\n`;
  output += `  Status: ${summary.valid ? '✅ Valid' : '❌ Has errors'}\n\n`;

  if (results.length === 0) {
    output += `✅ All validation checks passed!\n`;
    return output;
  }

  // Group by level
  const errors = results.filter(r => r.level === 'error');
  const warnings = results.filter(r => r.level === 'warning');
  const info = results.filter(r => r.level === 'info');

  if (errors.length > 0) {
    output += `❌ ERRORS (${errors.length}):\n`;
    errors.forEach(error => {
      output += `  • ${error.field}: ${error.message}\n`;
      if (error.suggestion) {
        output += `    💡 ${error.suggestion}\n`;
      }
    });
    output += `\n`;
  }

  if (warnings.length > 0) {
    output += `⚠️  WARNINGS (${warnings.length}):\n`;
    warnings.forEach(warning => {
      output += `  • ${warning.field}: ${warning.message}\n`;
      if (warning.suggestion) {
        output += `    💡 ${warning.suggestion}\n`;
      }
    });
    output += `\n`;
  }

  if (info.length > 0) {
    output += `ℹ️  SUGGESTIONS (${info.length}):\n`;
    info.forEach(infoItem => {
      output += `  • ${infoItem.field}: ${infoItem.message}\n`;
      if (infoItem.suggestion) {
        output += `    💡 ${infoItem.suggestion}\n`;
      }
    });
  }

  return output;
}
