FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/node:20.16 as build-stage
# 创建工作目录
WORKDIR /app

# 设置目录权限
RUN mkdir -p /app/dist && chown -R node:node /app

# 切换到非root用户
USER node

# 设置 npm 镜像源和配置
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm config set fetch-retries 3 \
    && npm config set fetch-retry-mintimeout 5000 \
    && npm config set fetch-retry-maxtimeout 60000

# 复制 package.json 和 package-lock.json
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

# 安装依赖
RUN npm ci

# 所有项目文件复制到工作目录
COPY --chown=node:node . .

# 构建项目
RUN npm run build

# 验证构建输出
RUN ls -la /app/dist

# production stage
FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/node:20.16 as production-stage

# 设置构建时间环境变量
ARG BUILD_TIME
ENV BUILD_TIME=${BUILD_TIME}

# 设置端口环境变量
ENV PORT=3010
ENV HOSTNAME="0.0.0.0"

# 将独立构建的文件复制到工作目录
COPY --from=build-stage --chown=node:node /app/dist/standalone /app/
COPY --from=build-stage --chown=node:node /app/dist/static /app/dist/static
COPY --from=build-stage --chown=node:node /app/public /app/public

WORKDIR /app

# 切换到非root用户
USER node

# 验证文件存在
RUN ls -la /app/

EXPOSE 3010

# 启动独立应用
CMD ["node", "server.js"]
