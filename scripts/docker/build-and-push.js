#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * ============================================================================
 * Docker 镜像构建和推送脚本 (JavaScript 版本)
 * 用于自动化构建和推送 blog 项目的 Docker 镜像到阿里云容器镜像服务
 *
 * 主要功能：
 * 1. 自动构建 Docker 镜像
 * 2. 推送镜像到阿里云容器镜像服务
 * 3. 更新 docker-compose.yml 配置文件
 * 4. 清理未使用的镜像
 * ============================================================================
 */

import { execSync, spawn } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

// ============================================================================
// 配置变量 - 镜像仓库和项目相关配置
// ============================================================================

const CONFIG = {
  // 阿里云容器镜像服务的仓库地址
  REGISTRY_HOST: "crpi-6a105b9464djyzkq.cn-chengdu.personal.cr.aliyuncs.com",

  // 镜像命名空间，用于组织和管理镜像
  NAMESPACE: "jasonblog",

  // 镜像名称，对应项目名称
  IMAGE_NAME: "blog",
};

// ============================================================================
// 颜色输出函数 - 用于在终端显示不同颜色的日志信息
// ============================================================================

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

// 显示蓝色的信息日志，用于一般信息提示
function printInfo(message) {
  console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
}

// 显示绿色的成功日志，用于操作成功提示
function printSuccess(message) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
}

// 显示红色的错误日志，用于错误信息提示
function printError(message) {
  console.error(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

// 显示黄色的警告日志，用于警告信息提示
function printWarning(message) {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 执行 shell 命令并返回结果
 * @param {string} command - 要执行的命令
 * @param {boolean} silent - 是否静默执行（不显示输出）
 * @returns {string} 命令输出结果
 */
function executeCommand(command, silent = false) {
  try {
    const result = execSync(command, {
      encoding: "utf8",
      stdio: silent ? "pipe" : "inherit",
    });
    return result;
  } catch (error) {
    if (!silent) {
      printError(`命令执行失败: ${command}`);
      printError(error.message);
    }
    throw error;
  }
}

/**
 * 检查命令是否存在
 * @param {string} command - 命令名称
 * @returns {boolean} 命令是否存在
 */
function commandExists(command) {
  try {
    executeCommand(`which ${command}`, true);
    return true;
  } catch {
    return false;
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

/**
 * 从 package.json 读取项目版本号
 * @returns {string} 项目版本号
 */
function getPackageVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return packageJson.version;
  } catch (error) {
    printWarning("无法读取 package.json 中的版本号");
    return "0.0.1";
  }
}

/**
 * 交互式询问用户
 * @param {string} question - 问题
 * @returns {Promise<string>} 用户输入
 */
function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ============================================================================
// 主要功能函数
// ============================================================================

/**
 * 预检查 - 在执行构建和推送前检查环境和依赖
 * @param {Object} options - 选项配置
 */
async function preCheck(options) {
  printInfo("🔍 开始环境预检查...");

  // ========================================================================
  // 检查项1: Docker 服务状态检查
  // ========================================================================
  printInfo("  ├─ 检查 Docker 服务状态...");
  try {
    // 执行 docker info 命令检查 Docker 守护进程是否运行
    // 如果 Docker 未运行，此命令会抛出异常
    executeCommand("docker info", true);
    printSuccess("  ├─ ✅ Docker 服务运行正常");
  } catch {
    printError("  ├─ ❌ Docker 未运行或无法访问");
    printInfo("  └─ 💡 解决方案: 请启动 Docker Desktop 或 Docker 服务");
    process.exit(1);
  }

  // ========================================================================
  // 检查项2: 项目目录结构检查
  // ========================================================================
  printInfo("  ├─ 检查项目目录结构...");
  // 检查必需的文件是否存在
  const requiredFiles = ["package.json", "Dockerfile", "package-lock.json"];
  const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));

  if (missingFiles.length > 0) {
    printError(`  ├─ ❌ 缺少必需文件: ${missingFiles.join(", ")}`);
    printInfo("  └─ 💡 解决方案: 请在项目根目录运行此脚本");
    process.exit(1);
  }
  printSuccess("  ├─ ✅ 项目目录结构正确");

  // ========================================================================
  // 检查项3: 镜像仓库登录状态检查（仅在需要推送时检查）
  // ========================================================================
  if (!options.buildOnly) {
    printInfo("  ├─ 检查镜像仓库登录状态...");
    try {
      // 获取 Docker 信息，检查是否已登录到目标镜像仓库
      const dockerInfo = executeCommand("docker info", true);

      if (!dockerInfo.includes(CONFIG.REGISTRY_HOST)) {
        printWarning("  ├─ ⚠️  未检测到阿里云镜像仓库登录状态");
        printInfo(`  ├─ 💡 需要登录: docker login ${CONFIG.REGISTRY_HOST}`);

        // 交互式询问用户是否现在登录
        const answer = await askUser("  └─ 🤔 是否现在登录? (y/n): ");
        if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
          printInfo("  ├─ 🔐 正在登录阿里云镜像仓库...");
          executeCommand(`docker login ${CONFIG.REGISTRY_HOST}`);
          printSuccess("  ├─ ✅ 登录成功");
        } else {
          printError("  └─ ❌ 需要登录后才能推送镜像");
          process.exit(1);
        }
      } else {
        printSuccess("  ├─ ✅ 已登录阿里云镜像仓库");
      }
    } catch (error) {
      printWarning("  ├─ ⚠️  无法检查 Docker 登录状态");
      printInfo("  ├─ 💡 请确保已手动登录镜像仓库");
    }
  } else {
    printInfo("  ├─ ⏭️  跳过登录检查（仅构建模式）");
  }

  printSuccess("🎉 所有预检查项目通过！");
}

/**
 * 构建镜像 - 使用 Dockerfile 构建 Docker 镜像
 * @param {Object} options - 构建选项
 */
function buildImage(options) {
  printInfo("🔨 开始构建 Docker 镜像...");

  const { version, extraTag, noCache } = options;
  const fullImageName = `${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}/${CONFIG.IMAGE_NAME}`;

  // ========================================================================
  // 步骤1: 准备构建参数和配置
  // ========================================================================
  printInfo("  ├─ 准备构建参数...");
  let buildArgs = "";
  if (noCache) {
    buildArgs = "--no-cache";
    printInfo("  ├─ 🚫 使用 --no-cache 选项，不使用构建缓存");
    printInfo("  ├─ 💡 这会确保使用最新的基础镜像和依赖包");
  } else {
    printInfo("  ├─ 📦 使用构建缓存以提高构建速度");
  }

  printInfo(`  ├─ 🏷️  目标镜像: ${fullImageName}:${version}`);
  if (extraTag) {
    printInfo(`  ├─ 🏷️  额外标签: ${fullImageName}:${extraTag}`);
  }

  // ========================================================================
  // 步骤2: 执行 Docker 镜像构建
  // ========================================================================
  printInfo("  ├─ 🔧 执行 Docker 构建命令...");

  // 生成构建时间戳
  const buildTime = new Date().toISOString();
  printInfo(`  ├─ 🕐 构建时间: ${buildTime}`);

  const buildCommand = `docker build ${buildArgs} --build-arg BUILD_TIME="${buildTime}" -t "${fullImageName}:${version}" . --platform linux/amd64,linux/arm64`;
  printInfo(`  ├─ 📝 构建命令: ${buildCommand}`);

  try {
    // 执行构建命令，使用当前目录的 Dockerfile，并传递构建时间参数
    executeCommand(buildCommand);
    printSuccess("  ├─ ✅ Docker 镜像构建成功");
    printInfo(`  ├─ 💡 镜像中的构建时间已固定为: ${buildTime}`);
  } catch (error) {
    printError("  ├─ ❌ Docker 镜像构建失败");
    throw error;
  }

  // ========================================================================
  // 步骤3: 添加额外标签（如果指定）
  // ========================================================================
  if (extraTag) {
    printInfo("  ├─ 🏷️  添加额外标签...");
    try {
      // 为同一个镜像创建额外的标签引用
      executeCommand(
        `docker tag "${fullImageName}:${version}" "${fullImageName}:${extraTag}"`
      );
      printSuccess(`  ├─ ✅ 成功添加标签: ${extraTag}`);
    } catch (error) {
      printError("  ├─ ❌ 添加额外标签失败");
      throw error;
    }
  }

  // ========================================================================
  // 步骤4: 显示构建结果信息
  // ========================================================================
  printInfo("  ├─ 📊 显示镜像信息...");
  try {
    // 尝试使用 head 命令限制输出行数
    executeCommand(`docker images "${fullImageName}" | head -n 5`);
  } catch {
    try {
      // 如果 head 命令不可用，直接显示镜像信息
      executeCommand(`docker images "${fullImageName}"`);
    } catch (error) {
      printWarning("  ├─ ⚠️  无法显示镜像信息");
    }
  }

  printSuccess("🎉 Docker 镜像构建完成！");
}

/**
 * 推送镜像 - 将构建好的镜像推送到阿里云容器镜像服务
 * @param {Object} options - 推送选项
 */
function pushImage(options) {
  printInfo("📤 开始推送 Docker 镜像...");

  const { version, extraTag } = options;
  const fullImageName = `${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}/${CONFIG.IMAGE_NAME}`;

  // ========================================================================
  // 步骤1: 推送主版本标签到远程仓库
  // ========================================================================
  printInfo("  ├─ 📤 推送主版本镜像...");
  printInfo(`  ├─ 🎯 目标地址: ${fullImageName}:${version}`);
  printInfo(`  ├─ 🌐 远程仓库: ${CONFIG.REGISTRY_HOST}`);

  try {
    // 执行 docker push 命令将本地镜像上传到远程仓库
    executeCommand(`docker push "${fullImageName}:${version}"`);
    printSuccess(`  ├─ ✅ 主版本推送成功: ${version}`);
  } catch (error) {
    printError("  ├─ ❌ 主版本推送失败");
    throw error;
  }

  // ========================================================================
  // 步骤2: 推送额外标签（如果存在）
  // ========================================================================
  if (extraTag) {
    printInfo("  ├─ 📤 推送额外标签...");
    printInfo(`  ├─ 🏷️  额外标签: ${fullImageName}:${extraTag}`);

    try {
      // 推送额外标签到远程仓库
      executeCommand(`docker push "${fullImageName}:${extraTag}"`);
      printSuccess(`  ├─ ✅ 额外标签推送成功: ${extraTag}`);
    } catch (error) {
      printError("  ├─ ❌ 额外标签推送失败");
      throw error;
    }
  }

  // ========================================================================
  // 推送完成总结
  // ========================================================================
  printSuccess("🎉 所有镜像推送完成！");
  printInfo("  ├─ 📍 可用镜像地址:");
  printInfo(`  ├─   • ${fullImageName}:${version}`);
  if (extraTag) {
    printInfo(`  └─   • ${fullImageName}:${extraTag}`);
  } else {
    printInfo("  └─ 💡 镜像已成功上传到阿里云容器镜像服务");
  }
}

/**
 * 更新部署配置 - 自动更新 docker-compose.yml 中的镜像版本
 * @param {Object} options - 更新选项
 */
function updateDeployConfig(options) {
  printInfo("📝 开始更新部署配置文件...");

  const { version } = options;
  const fullImageName = `${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}/${CONFIG.IMAGE_NAME}`;

  // ========================================================================
  // 步骤1: 检查配置文件是否存在
  // ========================================================================
  printInfo("  ├─ 🔍 检查 docker-compose.yml 文件...");

  if (fs.existsSync("docker-compose.yml")) {
    printSuccess("  ├─ ✅ 发现 docker-compose.yml 文件");

    // ========================================================================
    // 步骤2: 创建配置文件备份
    // ========================================================================
    printInfo("  ├─ 💾 创建配置文件备份...");
    try {
      fs.copyFileSync("docker-compose.yml", "docker-compose.yml.backup");
      printSuccess("  ├─ ✅ 备份文件已创建: docker-compose.yml.backup");
    } catch (error) {
      printError("  ├─ ❌ 创建备份文件失败");
      throw error;
    }

    // ========================================================================
    // 步骤3: 读取并更新配置文件
    // ========================================================================
    printInfo("  ├─ 🔄 更新镜像版本配置...");
    try {
      // 读取原始配置文件内容
      let content = fs.readFileSync("docker-compose.yml", "utf8");

      // 构建正则表达式来匹配镜像配置行
      // 需要转义特殊字符以确保正则表达式正确工作
      const regex = new RegExp(
        `image: ${fullImageName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:.*`,
        "g"
      );

      // 替换镜像版本
      const newImageLine = `image: ${fullImageName}:${version}`;
      content = content.replace(regex, newImageLine);

      // 写回文件
      fs.writeFileSync("docker-compose.yml", content);
      printSuccess(`  ├─ ✅ 镜像版本已更新为: ${version}`);
    } catch (error) {
      printError("  ├─ ❌ 更新配置文件失败");
      throw error;
    }

    // ========================================================================
    // 步骤4: 显示配置变更（如果可能）
    // ========================================================================
    printInfo("  ├─ 📊 显示配置文件变更...");
    if (commandExists("git")) {
      try {
        // 使用 git diff 显示文件变更
        executeCommand("git diff docker-compose.yml");
        printInfo("  ├─ ✅ 配置变更已显示");
      } catch {
        printWarning("  ├─ ⚠️  无法显示 git diff（可能未初始化 git 仓库）");
      }
    } else {
      printInfo("  ├─ ⏭️  跳过变更显示（git 未安装）");
    }

    printSuccess("🎉 部署配置文件更新完成！");
  } else {
    printWarning("  └─ ⚠️  未发现 docker-compose.yml 文件，跳过配置更新");
  }
}

/**
 * 清理工作 - 清理构建过程中产生的临时镜像和悬空镜像
 */
function cleanup() {
  printInfo("🧹 开始清理工作...");

  // ========================================================================
  // 步骤1: 清理悬空镜像
  // ========================================================================
  printInfo("  ├─ 🗑️  清理悬空镜像（dangling images）...");
  try {
    // 执行 docker image prune 命令清理未使用的镜像
    // -f 参数表示强制执行，不需要用户确认
    const result = executeCommand("docker image prune -f", true);

    // 解析清理结果
    if (result && result.includes("Total reclaimed space")) {
      const spaceMatch = result.match(/Total reclaimed space: (.+)/);
      const reclaimedSpace = spaceMatch ? spaceMatch[1] : "未知";
      printSuccess(`  ├─ ✅ 清理完成，释放空间: ${reclaimedSpace}`);
    } else {
      printSuccess("  ├─ ✅ 清理完成（无需清理的镜像）");
    }
  } catch (error) {
    // 清理失败不影响主流程，只记录警告
    printWarning("  ├─ ⚠️  清理悬空镜像失败，但不影响主流程");
  }

  // ========================================================================
  // 步骤2: 显示当前镜像使用情况
  // ========================================================================
  printInfo("  ├─ 📊 显示当前 Docker 镜像使用情况...");
  try {
    executeCommand("docker system df", true);
    printInfo("  ├─ ✅ 系统使用情况已显示");
  } catch {
    printWarning("  ├─ ⚠️  无法显示系统使用情况");
  }

  printSuccess("🎉 清理工作完成！");
  printInfo("  └─ 💡 提示: 如需深度清理，可手动运行 docker system prune");
}

// ============================================================================
// 命令行参数解析
// ============================================================================

/**
 * 显示帮助信息
 */
function showHelp() {
  const defaultVersion = generateDefaultVersion();

  console.log("用法: node build-and-push.js [选项]");
  console.log("");
  console.log("选项:");
  console.log(
    `  -v, --version VERSION    指定镜像版本标签 (默认: ${defaultVersion})`
  );
  console.log("  -t, --tag TAG           额外的标签 (可选)");
  console.log("  --no-cache              构建时不使用缓存");
  console.log("  --build-only            仅构建，不推送");
  console.log("  --push-only VERSION     仅推送指定版本的镜像，不构建");
  console.log("  -h, --help              显示此帮助信息");
  console.log("");
  console.log("示例:");
  console.log(
    "  node build-and-push.js                           # 使用默认版本构建并推送"
  );
  console.log(
    "  node build-and-push.js -v v1.2.3                # 指定版本v1.2.3构建并推送"
  );
  console.log(
    "  node build-and-push.js -v v1.2.3 -t latest      # 构建v1.2.3版本并额外打上latest标签"
  );
  console.log(
    "  node build-and-push.js --build-only -v v1.2.3   # 仅构建v1.2.3版本，不推送"
  );
  console.log(
    "  node build-and-push.js --push-only v1.2.3       # 仅推送v1.2.3版本"
  );
  console.log(
    "  node build-and-push.js --no-cache -v v1.2.3     # 不使用缓存构建v1.2.3版本"
  );
}

/**
 * 解析命令行参数
 * @param {string[]} args - 命令行参数
 * @returns {Object} 解析后的选项
 */
function parseArguments(args) {
  const options = {
    version: "",
    extraTag: "",
    noCache: false,
    buildOnly: false,
    pushOnly: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case "-v":
      case "--version":
        options.version = args[++i];
        break;
      case "-t":
      case "--tag":
        options.extraTag = args[++i];
        break;
      case "--no-cache":
        options.noCache = true;
        break;
      case "--build-only":
        options.buildOnly = true;
        break;
      case "--push-only":
        options.pushOnly = true;
        options.version = args[++i];
        break;
      case "-h":
      case "--help":
        options.help = true;
        break;
      default:
        printError(`未知参数: ${arg}`);
        showHelp();
        process.exit(1);
    }
  }

  // 设置默认版本号
  if (!options.version && !options.pushOnly) {
    options.version = generateDefaultVersion();
  }

  // 验证仅推送模式的参数
  if (options.pushOnly && !options.version) {
    printError("使用 --push-only 时必须指定版本");
    process.exit(1);
  }

  return options;
}

// ============================================================================
// 主函数 - 脚本的主要执行逻辑
// ============================================================================

/**
 * 主函数
 * @param {Object} options - 执行选项
 */
async function main(options) {
  // 显示脚本标题和基本信息
  console.log(
    "============================================================================"
  );
  console.log("Docker 镜像构建和推送脚本 (JavaScript 版本)");
  console.log(
    "============================================================================"
  );

  // 显示当前构建的配置信息
  printInfo(`项目: ${CONFIG.IMAGE_NAME}`);
  printInfo(`镜像仓库: ${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}`);
  printInfo(`版本: ${options.version}`);
  if (options.extraTag) {
    printInfo(`额外标签: ${options.extraTag}`);
  }
  printInfo(`构建选项: ${options.noCache ? "不使用缓存" : "使用缓存"}`);

  console.log("");

  try {
    // ========================================================================
    // 执行模式判断和流程控制
    // ========================================================================

    // 仅推送模式 - 只推送已存在的镜像，不进行构建
    if (options.pushOnly) {
      printInfo("🔄 执行模式: 仅推送已存在的镜像");

      // 步骤1: 环境预检查（检查Docker状态和登录状态）
      printInfo("📋 步骤 1/2: 环境预检查");
      await preCheck(options);

      // 步骤2: 推送镜像到远程仓库
      printInfo("📋 步骤 2/2: 推送镜像");
      pushImage(options);

      printSuccess("✅ 仅推送模式完成!");
      return;
    }

    // ========================================================================
    // 正常构建流程 - 包含构建和可选的推送步骤
    // ========================================================================

    printInfo("🔄 执行模式: 完整构建流程");

    // 步骤1: 环境预检查（检查Docker状态、项目目录、登录状态等）
    printInfo("📋 步骤 1/5: 环境预检查");
    await preCheck(options);

    // 步骤2: 构建Docker镜像（使用Dockerfile构建镜像）
    printInfo("📋 步骤 2/5: 构建Docker镜像");
    buildImage(options);

    // ========================================================================
    // 仅构建模式 - 只构建镜像，不推送到远程仓库
    // ========================================================================

    if (options.buildOnly) {
      printSuccess("✅ 仅构建模式完成!");
      return;
    }

    // ========================================================================
    // 完整流程 - 构建、推送、更新配置、清理
    // ========================================================================

    // 步骤3: 推送镜像到远程仓库（上传到阿里云镜像仓库）
    printInfo("📋 步骤 3/5: 推送镜像到远程仓库");
    pushImage(options);

    // 步骤4: 更新本地部署配置文件（自动更新docker-compose.yml）
    printInfo("📋 步骤 4/5: 更新部署配置文件");
    updateDeployConfig(options);

    // 步骤5: 清理临时文件和未使用的镜像（释放磁盘空间）
    printInfo("📋 步骤 5/5: 清理工作");
    cleanup();

    // 完成提示
    console.log("");
    console.log(
      "============================================================================"
    );
    printSuccess("所有操作完成!");
    console.log(
      "============================================================================"
    );
    printInfo(
      `镜像地址: ${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}/${CONFIG.IMAGE_NAME}:${options.version}`
    );
    if (options.extraTag) {
      printInfo(
        `额外标签: ${CONFIG.REGISTRY_HOST}/${CONFIG.NAMESPACE}/${CONFIG.IMAGE_NAME}:${options.extraTag}`
      );
    }
    printInfo("下一步: 可以运行部署脚本或手动部署到服务器");
    console.log(
      "============================================================================"
    );
  } catch (error) {
    printError("脚本执行失败");
    printError(error.message);
    process.exit(1);
  }
}

// ============================================================================
// 脚本入口点
// ============================================================================

// 如果直接运行此文件（不是被 require 引入）
if (import.meta.url === `file://${process.argv[1]}`) {
  // 解析命令行参数（跳过 node 和脚本文件名）
  const args = process.argv.slice(2);
  const options = parseArguments(args);

  // 显示帮助信息
  if (options.help) {
    showHelp();
    process.exit(0);
  }

  // 执行主函数
  main(options).catch((error) => {
    printError("未处理的错误:");
    console.error(error);
    process.exit(1);
  });
}
