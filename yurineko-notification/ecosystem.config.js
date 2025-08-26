module.exports = {
  apps: [{
    name: 'yurineko-notification',
    script: 'dist/main.js',
    // interpreter: '/root/.nvm/versions/node/v16.18.0/bin/node',

    instances: 1,
    autorestart: true,
    watch: false,
    wait_ready: true,
    listen_timeout: 10000,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
