/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@neofinancial/morpheus-components',
    '@neofinancial/morpheus-theme-dark',
    '@neofinancial/morpheus-theme-light',
    '@mui/material',
    '@emotion/styled',
    '@emotion/react',
    '@emotion/cache',
  ],
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true,
    },
    '@neofinancial/morpheus-components': {
      transform: '@neofinancial/morpheus-components/lib/{{member}}',
      preventFullImport: true,
    },
    '@neofinancial/morpheus-icons': {
      transform: '@neofinancial/morpheus-icons/lib/{{member}}',
      preventFullImport: true,
    },
  },
};

module.exports = nextConfig;
