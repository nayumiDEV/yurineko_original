module.exports = {
  apps: [
    {
      name: 'yurineko-ln-client',
      script: 'yarn start',
      time: true,
      instances: 1,
      autorestart: true,
      max_restarts: 50,
      watch: false,
      max_memory_restart: '1G',
      env: {
        PORT: 3004,
      },
    },
  ],
  deploy: {
    production: {
      user: 'user',
      host: '0.0.0.0',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: './',
      'post-deploy':
        'yarn install && yarn run build && pm2 reload ecosystem.config.js --env production --only yurineko-ln-client',
      env: {
        PORT: 3004,
      },
    },
  },
}
