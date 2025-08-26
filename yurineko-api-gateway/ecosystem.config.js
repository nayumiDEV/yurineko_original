module.exports = {
  apps : [{
    name: 'yurineko-api-gateway',
    script: 'dist/main.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      PORT: 50050,
      NODE_ENV: 'development'
    },
    env_production: {
      PORT: 50050,
      NODE_ENV: 'production'
    }
  }]
};