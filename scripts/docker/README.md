# Docker 构建和推送脚本使用指南

这个目录包含用于自动化构建和推送 Docker 镜像到阿里云容器镜像服务的 JavaScript 脚本。

## 脚本列表

### 1. `build-and-push.js` - 完整功能脚本

功能强大的构建和推送脚本，使用 Node.js 编写，支持多种选项和模式。

#### 使用方法

```bash
# 基本用法 - 使用时间戳版本构建并推送
node ./scripts/docker/build-and-push.js

# 或者使用 npm 脚本
npm run docker:build
```

#### 高级用法

```bash
# 指定版本号
node ./scripts/docker/build-and-push.js -v v1.2.3

# 指定版本号并添加 latest 标签
node ./scripts/docker/build-and-push.js -v v1.2.3 -t latest

# 不使用缓存构建
node ./scripts/docker/build-and-push.js --no-cache -v v1.2.3

# 仅构建，不推送
node ./scripts/docker/build-and-push.js --build-only -v v1.2.3

# 仅推送已存在的镜像
node ./scripts/docker/build-and-push.js --push-only v1.2.3

# 查看帮助
node ./scripts/docker/build-and-push.js --help
```

#### 支持的参数

- `-v, --version VERSION`: 指定镜像版本标签
- `-t, --tag TAG`: 额外的标签（如 latest）
- `--no-cache`: 构建时不使用缓存
- `--build-only`: 仅构建，不推送
- `--push-only VERSION`: 仅推送指定版本的镜像
- `-h, --help`: 显示帮助信息

### 2. `quick-build.js` - 快速构建脚本

简化版本的构建脚本，使用 Node.js 编写，用于快速构建和推送。

#### 使用方法

```bash
# 使用时间戳版本
node ./scripts/docker/quick-build.js

# 指定版本号
node ./scripts/docker/quick-build.js v1.2.3

# 或者使用 npm 脚本
npm run docker:quick
npm run docker:quick v1.2.3
```

## 前置要求

1. **Docker 已安装并运行**
   ```bash
   docker --version
   docker info
   ```

2. **已登录阿里云容器镜像服务**
   ```bash
   docker login crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com
   ```

3. **在项目根目录运行脚本**
   确保当前目录包含 `package.json` 和 `Dockerfile`

## 镜像仓库配置

当前配置的镜像仓库信息：
- **仓库地址**: `crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com`
- **命名空间**: `jasonblog`
- **镜像名称**: `blog`

完整镜像地址格式：
```
crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com/jasonblog/blog:版本号
```

## 自动化功能

脚本会自动执行以下操作：

1. ✅ **预检查**
   - 检查 Docker 是否运行
   - 检查是否在项目根目录
   - 检查是否已登录阿里云镜像仓库

2. 🔨 **构建镜像**
   - 使用项目根目录的 Dockerfile 构建镜像
   - 支持缓存和无缓存构建

3. 📤 **推送镜像**
   - 推送到阿里云容器镜像服务
   - 支持多标签推送

4. 📝 **更新配置**
   - 自动更新 `docker-compose.yml` 中的镜像版本
   - 创建配置文件备份

5. 🧹 **清理工作**
   - 清理未使用的 Docker 镜像
   - 释放磁盘空间

## 版本策略

### 默认版本号格式
如果不指定版本号，脚本会使用时间戳格式：
```
v20231215_143052
```

### 推荐版本号格式
- **语义化版本**: `v1.0.0`, `v1.2.3`
- **发布版本**: `v2023.12.15`, `v2024.01.01`
- **特性版本**: `v1.2.3-beta`, `v1.2.3-alpha`

## 常见问题

### Q: 如何修改镜像仓库地址？
A: 编辑脚本文件中的 CONFIG 对象：
```javascript
const CONFIG = {
    REGISTRY_HOST: '你的仓库地址',
    NAMESPACE: '你的命名空间',
    IMAGE_NAME: '你的镜像名称'
};
```

### Q: 构建失败怎么办？
A: 检查以下项目：
1. Docker 是否正常运行
2. Dockerfile 语法是否正确
3. 项目依赖是否完整
4. 网络连接是否正常

### Q: 推送失败怎么办？
A: 检查以下项目：
1. 是否已登录阿里云镜像仓库
2. 网络连接是否正常
3. 镜像仓库权限是否正确

### Q: 如何回滚到之前的版本？
A: 使用以下命令：
```bash
# 仅推送已存在的旧版本镜像
node ./scripts/docker/build-and-push.js --push-only v1.2.2

# 手动更新 docker-compose.yml
sed -i.backup "s|image: .*/blog:.*|image: crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com/jasonblog/blog:v1.2.2|g" docker-compose.yml
```

## 与部署流程集成

构建完成后，可以触发 GitHub Actions 部署：

```bash
# 1. 构建并推送镜像
npm run docker:build -- -v v1.2.3

# 2. 提交配置文件变更
git add docker-compose.yml
git commit -m "update: 更新镜像版本到 v1.2.3"
git push

# 3. 触发部署
# 在 GitHub 仓库的 Actions 页面手动触发部署工作流
```

## 脚本维护

如需修改脚本配置，主要关注以下文件：
- `build-and-push.js`: 完整功能脚本
- `quick-build.js`: 快速构建脚本
- `package.json`: npm 脚本配置 