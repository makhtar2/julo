import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
    ...nextCoreWebVitals,
    {
        ignores: [
            '.next/**',
            'out/**',
            'build/**',
            'node_modules/**',
            'public/workbox-*.js',
            'public/sw.js',
        ],
    },
];

export default eslintConfig;
