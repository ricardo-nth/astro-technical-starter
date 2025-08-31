export interface MetaData {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  robots?: string;
  author?: string;
  publisher?: string;
  keywords?: string;
  ogType?: string;
  siteName?: string;
  twitterCard?: string;
  twitterCreator?: string;
  themeColor?: string;
  locale?: string;
}

export type SchemaData = Record<string, any> | Array<Record<string, any>>;
