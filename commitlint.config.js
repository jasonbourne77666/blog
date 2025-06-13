// build: 影响构建系统或外部依赖项的更改（示例范围：gulp、broccoli、npm）
// ci: 更改我们的 CI 配置文件和脚本（示例范围：Travis、Circle、BrowserStack、SauceLabs）
// docs: 文档修改
// feat: 一个新的功能
// fix: 一个 bug 修复
// perf: 提升性能的代码修改
// refactor: 既不修复错误也不添加功能的代码更改
// style: 不影响代码含义的更改（空格、格式、缺少分号等）
// test: 添加缺失的测试或更正现有测试

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是新增功能，也不是修改bug的代码变动）
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回滚
        'build', // 打包
        'ci', // CI配置相关
      ],
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72],
  },
};
