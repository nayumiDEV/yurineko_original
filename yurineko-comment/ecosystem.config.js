module.exports = {
  apps : [{
    name: 'yurineko-comment',
    script: 'dist/main.js',

    instances: 1,
    autorestart: true,
    watch: false,
    wait_ready: true,
    listen_timeout: 10000,
    env: {
      PORT: 3300,
      NODE_ENV: 'development'
    },
    env_production: {
      PORT: 3300,
      NODE_ENV: 'production'
    }
  }]
};