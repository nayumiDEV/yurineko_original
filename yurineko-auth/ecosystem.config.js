module.exports = {
  apps : [{
    name: 'yurineko-auth',
    script: 'dist/main.js',
    interpreter: 'node@16.18.0',

    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};