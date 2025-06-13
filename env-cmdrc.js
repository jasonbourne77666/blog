const dev = {
  NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3001',
  NEXT_PUBLIC_NODE_ENV: 'dev',
};

const prod = {
  NEXT_PUBLIC_API_BASE_URL: '47.109.95.244',
  NEXT_PUBLIC_NODE_ENV: 'prod',
};

module.exports = {
  // 开发环境启动配置
  'server:dev': {
    ...dev,
  },
  // 开发环境构建配置
  'build:dev': {
    ...dev,
  },
  // 开发环境启动配置
  'start:dev': {
    ...dev,
  },
  // 生产环境启动配置
  'server:prod': {
    ...prod,
  },
  // 生产环境构建配置
  'build:prod': {
    ...prod,
  },
  // 生产环境启动配置
  'start:prod': {
    ...prod,
  },
};
