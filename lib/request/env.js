/* TODO: 切换正式测试环境域名 */
const NODE_ENV = 'test';

const env = {
  prod: {
    // host: 'https://api.nightmodeplus.com',
    // api_key: 'CuTVbJgQyRrLNi62',
    // api_secret: 'NS5KBSofjbGdLKwYKcxYCCv02ScpSF8TFZIcyJlcEunQg4kKB3tfwQOCbtUhSo8i2DC6Ffoy',
    // sourceHost: 'https://api.nightmodeplus.com/source/',
    host: 'https://bpi.nightmodeplus.com',
    api_key: 'k8pUOCZJd0Mur72L',
    api_secret: '2BR2RIHnvB4KVuZem8rdEIjJn4oXFWQHCZ9VnQ5t2E5bIkW7j61YxlBCShe8KEODioz2j2OI',
    sourceHost: 'https://bpi.nightmodeplus.com/source/'
  },
  test: {
    host: 'https://dev.api.nightmodeplus.com',
    api_key: 'k8pUOCZJd0Mur72L',
    api_secret: '2BR2RIHnvB4KVuZem8rdEIjJn4oXFWQHCZ9VnQ5t2E5bIkW7j61YxlBCShe8KEODioz2j2OI',
    sourceHost: 'https://dev.api.nightmodeplus.com/source/'
  }
};

module.exports = env[NODE_ENV];
