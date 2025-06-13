#!/usr/bin/env node

/**
 * 测试 Docker 构建脚本
 */

import { execSync } from 'child_process';

console.log('🧪 测试 Docker 构建脚本...');

try {
  // 测试帮助信息
  console.log('📋 测试帮助信息...');
  execSync('node scripts/docker/build-and-push.js --help', {
    stdio: 'inherit',
  });

  console.log('\n✅ 构建脚本测试通过！');
} catch (error) {
  console.error('❌ 构建脚本测试失败:', error.message);
  process.exit(1);
}
