const dev = {
  NEXT_PUBLIC_API_BASE_URL: 'http://localhost:3000/api',
  NEXT_PUBLIC_NODE_ENV: 'dev',
};

const prod = {
  NEXT_PUBLIC_API_BASE_URL: 'https://api.yourdomain.com',
  NODE_ENNEXT_PUBLIC_NODE_ENVV: 'prod',
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
