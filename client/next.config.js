const nextConfig = {
  reactStrictMode: true,
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};

module.exports = nextConfig;


// 223.dersi sabah yendıen dınle ıng altyazılıda ıncele 