/* TODO: 切换正式测试环境域名 */
const NODE_ENV = 'test';

const env = {
  prod: {
    host: 'https://api.nightmodeplus.com',
    api_key: '',
    api_secret: '',
    sourceHost: 'https://api.nightmodeplus.com/source/'
  },
  test: {
    host: 'https://dev.api.nightmodeplus.com',
    api_key: 'k8pUOCZJd0Mur72L',
    api_secret: '2BR2RIHnvB4KVuZem8rdEIjJn4oXFWQHCZ9VnQ5t2E5bIkW7j61YxlBCShe8KEODioz2j2OI',
    sourceHost: 'https://dev.api.nightmodeplus.com/source/'
  }
};

module.exports = env[NODE_ENV];
