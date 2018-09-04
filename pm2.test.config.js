module.exports = {
  apps : [{
    name      : 'punchcard-server',
    script    : './index.js',
    env: {
      NODE_ENV: 'test'
    }
  }]
};
