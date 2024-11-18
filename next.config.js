/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    MQTT_HOST: process.env.MQTT_HOST,
    MQTT_PORT: process.env.MQTT_PORT,
    MQTT_WS_PORT: process.env.MQTT_WS_PORT,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig; 