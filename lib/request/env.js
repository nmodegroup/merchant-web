const NODE_ENV = 'test';

const env = {
  prod: {
    host: 'https://api.nightmodeplus.com',
    api_key: '',
    api_secret: ''
  },
  test: {
    host: 'https://dev.api.nightmodeplus.com',
    api_key: 'k8pUOCZJd0Mur72L',
    api_secret: '2BR2RIHnvB4KVuZem8rdEIjJn4oXFWQHCZ9VnQ5t2E5bIkW7j61YxlBCShe8KEODioz2j2OI'
  }
};

module.exports = env[NODE_ENV];
