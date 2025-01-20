import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/config/i18n.ts");
const nextConfig: NextConfig = {
  images: {
    domains: [
      '127.0.0.1',
      'ogtihpenkjkzmtjfetoa.supabase.co',
      'localhost',
    ],
  },
  /* other config options here */
};

export default withNextIntl(nextConfig);
