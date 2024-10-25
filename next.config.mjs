/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@/components': path.join(process.cwd(), 'src', 'app', 'components'),
            '@/public/img': path.join(process.cwd(), 'public', 'img'),
            '@@/public/favicon.ico': path.join(process.cwd(), 'public', 'favicon.ico')
        };
        return config;
    },
};

export default nextConfig;