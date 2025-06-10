#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * ============================================================================
 * 快速构建和推送脚本 (JavaScript 版本)
 * 用于快速构建和推送 Docker 镜像到阿里云镜像仓库
 *
 * 这是一个简化版本的构建脚本，适合日常快速构建使用
 * 主要功能：
 * 1. 构建 Docker 镜像
 * 2. 推送到阿里云容器镜像服务
 * 3. 更新 docker-compose.yml 配置
 * ============================================================================
 */

import { execSync } from "child_process";
import fs from "fs";

// ============================================================================
// 镜像仓库配置 - 阿里云容器镜像服务相关配置
// ============================================================================

const CONFIG = {
  // 阿里云容器镜像服务的仓库地址
  REGISTRY_HOST: "crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com",

  // 镜像命名空间，用于组织管理镜像
  NAMESPACE: "jasonblog",

  // 镜像名称，对应项目名称
  IMAGE_NAME: "blog",
};

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 执行 shell 命令
 * @param {string} command - 要执行的命令
 * @param {boolean} silent - 是否静默执行
 */
function executeCommand(command, silent = false) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: silent ? "pipe" : "inherit",
    });
  } catch (error) {
    if (!silent) {
      console.error(`❌ 命令执行失败: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

/**
 * 生成默认版本号（时间戳格式）
 * @returns {string} 版本号，格式：v20231215_143052
 */
function generateDefaultVersion() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `v${year}${month}${day}_${hour}${minute}${second}`;
}

// ============================================================================
// 命令行参数处理
// ============================================================================

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log("🚀 快速构建和推送脚本");
  console.log("");
  console.log("用法:");
  console.log("  node quick-build.js [版本号]");
  console.log("");
  console.log("参数:");
  console.log(
    "  版本号    可选，指定镜像版本号，如果不提供则自动生成时间戳版本"
  );
  console.log("");
  console.log("选项:");
  console.log("  --help    显示此帮助信息");
  console.log("");
  console.log("示例:");
  console.log("  node quick-build.js              # 使用自动生成的时间戳版本");
  console.log("  node quick-build.js v1.2.0       # 使用指定版本号");
  console.log("  node quick-build.js latest       # 使用 latest 标签");
  console.log("");
  process.exit(0);
}

// 检查是否请求帮助
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  showHelp();
}

// ============================================================================
// 主要执行流程
// ============================================================================

// 版本号处理：
// process.argv[2] 表示脚本的第一个参数（用户指定的版本号）
// 如果没有提供参数，则使用默认的时间戳版本
const version = process.argv[2] || generateDefaultVersion();

// 组装完整的镜像名称，包含仓库地址、命名空间、镜像名和版本号
const fullImageName = `${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}/${CONFIG.IMAGE_NAME}:${version}`;

console.log("🚀 开始构建和推送 Docker 镜像...");
console.log(`📦 目标镜像: ${fullImageName}`);
console.log("📋 执行步骤: 环境检查 → 镜像构建 → 镜像推送 → 配置更新");
console.log("");

try {
  // ========================================================================
  // 步骤 1/4: 环境检查 - 确保运行环境满足构建要求
  // ========================================================================
  console.log("📋 步骤 1/4: 环境检查");

  // 检查项1: Docker 服务状态
  console.log("  ├─ 检查 Docker 服务状态...");
  try {
    // docker info 命令会返回 Docker 守护进程信息，如果失败说明 Docker 未运行
    executeCommand("docker info", true);
    console.log("  ├─ ✅ Docker 服务运行正常");
  } catch {
    console.error("  ├─ ❌ Docker 未运行，请启动 Docker 后重试");
    console.log("  └─ 💡 解决方案: 启动 Docker Desktop 或检查 Docker 服务状态");
    process.exit(1);
  }

  // 检查项2: 项目目录结构
  console.log("  ├─ 检查项目目录结构...");
  // 通过检查关键文件来确认当前位置
  const requiredFiles = ["package.json", "Dockerfile"];
  const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

  if (missingFiles.length > 0) {
    console.error(`  ├─ ❌ 缺少必需文件: ${missingFiles.join(", ")}`);
    console.log("  └─ 💡 解决方案: 确保在项目根目录运行此脚本");
    process.exit(1);
  }
  console.log("  └─ ✅ 项目目录结构正确");

  // ========================================================================
  // 步骤 2/4: 镜像构建 - 使用 Dockerfile 构建 Docker 镜像
  // ========================================================================
  console.log("📋 步骤 2/4: 镜像构建");
  console.log("  ├─ 🔧 准备构建参数...");
  console.log(`  ├─ 📝 构建命令: docker build -t "${fullImageName}" .`);
  console.log(
    "  ├─ 💡 说明: -t 参数指定镜像标签，. 表示使用当前目录作为构建上下文"
  );

  console.log("  ├─ 🔨 开始构建镜像...");

  // 生成构建时间戳
  const buildTime = new Date().toISOString();
  console.log(`  ├─ 🕐 构建时间: ${buildTime}`);

  try {
    // docker build 命令说明：
    // -t 参数：为镜像指定标签（tag）
    // --build-arg 参数：传递构建参数到 Dockerfile
    // . 参数：使用当前目录作为构建上下文，Docker 会将当前目录的内容发送给 Docker 守护进程
    const buildCommand = `docker build --build-arg BUILD_TIME="${buildTime}" -t "${fullImageName}" .`;
    console.log(`  ├─ 📝 构建命令: ${buildCommand}`);

    executeCommand(buildCommand);
    console.log("  ├─ ✅ 镜像构建成功");
    console.log(`  └─ 💡 镜像中的构建时间已固定为: ${buildTime}`);
  } catch (error) {
    console.error("  └─ ❌ 镜像构建失败");
    throw error;
  }

  // ========================================================================
  // 步骤 3/4: 镜像推送 - 将构建好的镜像推送到阿里云容器镜像服务
  // ========================================================================
  console.log("📋 步骤 3/4: 镜像推送");
  console.log("  ├─ 📤 开始推送镜像到阿里云...");
  console.log(`  ├─ 🎯 目标仓库: ${CONFIG.REGISTRY_HOST}`);
  console.log("  ├─ 💡 说明: 需要事先登录镜像仓库 (docker login)");

  try {
    // docker push 命令将本地镜像上传到远程镜像仓库
    // 需要事先登录到对应的镜像仓库: docker login <仓库地址>
    executeCommand(`docker push "${fullImageName}"`);
    console.log("  └─ ✅ 镜像推送成功");
  } catch (error) {
    console.error("  ├─ ❌ 镜像推送失败");
    console.log("  └─ 💡 请检查网络连接和登录状态");
    throw error;
  }

  // ========================================================================
  // 步骤 4/4: 配置更新 - 自动更新部署配置文件中的镜像版本
  // ========================================================================
  console.log("📋 步骤 4/4: 配置更新");

  // 检查 docker-compose.yml 文件是否存在
  if (fs.existsSync("docker-compose.yml")) {
    console.log("  ├─ 📝 发现 docker-compose.yml 文件");
    console.log("  ├─ 💾 创建配置文件备份...");

    try {
      // 创建备份文件
      fs.copyFileSync("docker-compose.yml", "docker-compose.yml.backup");
      console.log("  ├─ ✅ 备份文件已创建: docker-compose.yml.backup");

      // 读取并更新配置文件中的镜像版本
      console.log("  ├─ 🔄 更新镜像版本配置...");
      let content = fs.readFileSync("docker-compose.yml", "utf8");

      // 使用正则表达式匹配并替换镜像地址和版本号
      const imagePattern = `${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}/${CONFIG.IMAGE_NAME}`;
      const regex = new RegExp(
        `image: ${imagePattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:.*`,
        "g"
      );
      content = content.replace(regex, `image: ${fullImageName}`);

      // 写回文件
      fs.writeFileSync("docker-compose.yml", content);
      console.log("  └─ ✅ docker-compose.yml 更新完成");
    } catch (error) {
      console.error("  └─ ❌ 配置文件更新失败");
      throw error;
    }
  } else {
    console.log("  └─ ⏭️  未发现 docker-compose.yml 文件，跳过配置更新");
  }

  // ========================================================================
  // 完成提示 - 显示构建结果和后续操作建议
  // ========================================================================

  console.log("");
  console.log("🎉 所有步骤执行完成！");
  console.log("");
  console.log("📊 执行结果摘要:");
  console.log(`  ├─ ✅ 镜像构建: 成功`);
  console.log(`  ├─ ✅ 镜像推送: 成功`);
  console.log(`  ├─ ✅ 配置更新: 成功`);
  console.log(`  └─ 📍 镜像地址: ${fullImageName}`);
  console.log("");
  console.log("🚀 后续部署步骤:");
  console.log("  1️⃣  提交配置文件变更:");
  console.log("      git add docker-compose.yml");
  console.log(`      git commit -m "update: 更新镜像版本到 ${version}"`);
  console.log("      git push");
  console.log("");
  console.log("  2️⃣  触发自动部署:");
  console.log("      在 GitHub 仓库的 Actions 页面手动触发部署工作流");
  console.log("      或者等待自动触发（如果配置了自动部署）");
  console.log("");
  console.log("  3️⃣  验证部署结果:");
  console.log("      检查服务器上的应用是否正常运行");
  console.log("      确认新版本功能是否正常");
  console.log("");
  console.log("💡 提示: 如需回滚，可以使用之前的镜像版本重新部署");
} catch (error) {
  console.error("");
  console.error("❌ 脚本执行过程中发生错误");
  console.error("🔍 错误详情:");
  console.error(`   ${error.message}`);
  console.error("");
  console.error("🛠️  常见解决方案:");
  console.error("   1. 检查 Docker 服务是否正常运行");
  console.error("   2. 检查网络连接是否正常");
  console.error("   3. 检查是否已登录阿里云镜像仓库");
  console.error("   4. 检查 Dockerfile 语法是否正确");
  console.error("   5. 检查项目依赖是否完整");
  console.error("");
  process.exit(1);
}
