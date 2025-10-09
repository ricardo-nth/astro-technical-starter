/**
 * Plugin Architecture for Astro Technical SEO Starter
 * Enables extensible features for paid/premium versions
 */

export interface PluginConfig {
  name: string;
  version: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface Plugin {
  name: string;
  version: string;
  description: string;
  category: 'seo' | 'analytics' | 'performance' | 'content' | 'ecommerce' | 'local' | 'enterprise';
  tier: 'free' | 'premium' | 'enterprise';
  init: (config?: Record<string, any>) => Promise<void> | void;
  cleanup?: () => Promise<void> | void;
  dependencies?: string[];
}

export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private activePlugins: Map<string, Plugin> = new Map();
  private config: Map<string, PluginConfig> = new Map();

  constructor(initialConfig: PluginConfig[] = []) {
    initialConfig.forEach(config => {
      this.config.set(config.name, config);
    });
  }

  /**
   * Register a plugin
   */
  register(plugin: Plugin): void {
    this.plugins.set(plugin.name, plugin);
    console.log(`✅ Plugin registered: ${plugin.name} v${plugin.version}`);
  }

  /**
   * Enable and initialize a plugin
   */
  async enable(pluginName: string, config?: Record<string, any>): Promise<boolean> {
    const plugin = this.plugins.get(pluginName);
    if (!plugin) {
      console.error(`❌ Plugin not found: ${pluginName}`);
      return false;
    }

    // Check dependencies
    if (plugin.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!this.activePlugins.has(dep)) {
          console.error(`❌ Missing dependency for ${pluginName}: ${dep}`);
          return false;
        }
      }
    }

    try {
      await plugin.init(config);
      this.activePlugins.set(pluginName, plugin);
      console.log(`🚀 Plugin enabled: ${pluginName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to enable plugin ${pluginName}:`, error);
      return false;
    }
  }

  /**
   * Disable a plugin
   */
  async disable(pluginName: string): Promise<boolean> {
    const plugin = this.activePlugins.get(pluginName);
    if (!plugin) {
      console.warn(`⚠️ Plugin not active: ${pluginName}`);
      return false;
    }

    try {
      if (plugin.cleanup) {
        await plugin.cleanup();
      }
      this.activePlugins.delete(pluginName);
      console.log(`🔌 Plugin disabled: ${pluginName}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to disable plugin ${pluginName}:`, error);
      return false;
    }
  }

  /**
   * Get all available plugins
   */
  getAvailablePlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get active plugins
   */
  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins.values());
  }

  /**
   * Get plugins by category
   */
  getPluginsByCategory(category: Plugin['category']): Plugin[] {
    return this.getAvailablePlugins().filter(plugin => plugin.category === category);
  }

  /**
   * Get plugins by tier
   */
  getPluginsByTier(tier: Plugin['tier']): Plugin[] {
    return this.getAvailablePlugins().filter(plugin => plugin.tier === tier);
  }

  /**
   * Initialize all enabled plugins from config
   */
  async initializeFromConfig(): Promise<void> {
    const enabledConfigs = Array.from(this.config.values()).filter(config => config.enabled);
    
    for (const config of enabledConfigs) {
      await this.enable(config.name, config.config);
    }
  }
}

// Plugin registry - Available plugins by tier
export const AVAILABLE_PLUGINS = {
  free: [
    'basic-analytics',
    'seo-validation',
    'performance-monitoring',
    'accessibility-checker'
  ],
  premium: [
    'advanced-analytics',
    'a-b-testing',
    'conversion-tracking',
    'social-automation',
    'content-optimization',
    'competitor-analysis'
  ],
  enterprise: [
    'multi-language-seo',
    'advanced-schema',
    'enterprise-analytics',
    'custom-integrations',
    'white-label-branding',
    'priority-support'
  ]
};

// Example plugins for different tiers

export const basicAnalyticsPlugin: Plugin = {
  name: 'basic-analytics',
  version: '1.0.0',
  description: 'Basic Google Analytics integration',
  category: 'analytics',
  tier: 'free',
  init: async () => {
    console.log('🔍 Basic Analytics initialized');
    // Initialize GA4 basic tracking
  }
};

export const ecommercePlugin: Plugin = {
  name: 'ecommerce-seo',
  version: '1.0.0',
  description: 'E-commerce specific SEO optimizations',
  category: 'ecommerce',
  tier: 'premium',
  dependencies: ['basic-analytics'],
  init: async () => {
    console.log('🛒 E-commerce SEO initialized');
    // Add product schema, shopping analytics, etc.
  }
};

export const localBusinessPlugin: Plugin = {
  name: 'local-business',
  version: '1.0.0',
  description: 'Local business SEO features',
  category: 'local',
  tier: 'premium',
  init: async () => {
    console.log('📍 Local Business SEO initialized');
    // Add local schema, maps integration, etc.
  }
};

export const enterpriseAnalyticsPlugin: Plugin = {
  name: 'enterprise-analytics',
  version: '1.0.0',
  description: 'Advanced analytics with custom dashboards',
  category: 'analytics',
  tier: 'enterprise',
  dependencies: ['basic-analytics'],
  init: async () => {
    console.log('📁 Enterprise Analytics initialized');
    // Initialize advanced tracking, custom events, etc.
  }
};

// Default plugin manager instance
export const pluginManager = new PluginManager();

// Register available plugins
pluginManager.register(basicAnalyticsPlugin);
pluginManager.register(ecommercePlugin);
pluginManager.register(localBusinessPlugin);
pluginManager.register(enterpriseAnalyticsPlugin);
