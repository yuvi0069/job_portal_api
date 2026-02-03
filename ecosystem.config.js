module.exports = {
    apps: [
      {
        name: 'JOBAPI',
        script: 'dist/server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        env: {
          NODE_ENV: 'production',
          APP_NAME: '',
          APP_HOST: '',
          PORT: 5020,
          DB_HOST: 'localhost',
          DB_PORT: 5432,
          DB_USER: 'postgres',
          DB_PASSWORD: 'root',
          DB_DATABASE: 'career',
        },
      },
    ],
  };