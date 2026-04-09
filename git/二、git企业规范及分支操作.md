# Git Flow 在企业开发中的应用与规范

以下是适用于企业开发的 **Git 命令规范** 和 **分支操作流程**，基于业界主流的 **Git Flow** 工作流设计，确保团队协作高效、代码历史清晰。

### 一、分支管理规范（Git Flow 模型）

企业开发推荐采用 **Git Flow** 工作流，通过明确分支职责实现多版本并行开发与稳定发布。

|分支类型|命名规范|作用|生命周期|
|---|---|---|---|
|**主分支**|`main` / `master`|生产环境代码，始终保持稳定可发布|长期存在|
|**开发分支**|`develop`|功能集成分支，所有新功能开发的基础|长期存在|
|**功能分支**|`feature/xxx`（如 `feature/user-login`）|开发新功能|开发完成后删除|
|**发布分支**|`release/xxx`（如 `release/v1.0.0`）|发布前测试、Bug修复、版本号调整|发布完成后删除|
|**热修复分支**|`hotfix/xxx`（如 `hotfix/fix-crash`）|紧急修复生产环境Bug|修复完成后删除|

### 二、核心分支操作流程

#### 1. 功能开发（Feature）

```Bash
# 1. 从 develop 切出功能分支
git checkout develop
git pull origin develop  # 确保本地代码最新
git checkout -b feature/user-login

# 2. 开发过程中频繁提交（小步提交，便于回滚）
git add .
git commit -m "feat(login): 完成用户登录界面布局"  # 提交信息规范见下文

# 3. 开发完成后，合并回 develop
git checkout develop
git pull origin develop  # 先拉取远程最新代码，避免冲突
git merge --no-ff feature/user-login  # --no-ff 保留分支历史，便于追溯
git push origin develop

# 4. 删除本地功能分支（远程分支可通过PR合并后删除）
git branch -d feature/user-login
```

#### 2. 发布准备（Release）

当 `develop` 积累足够功能或到达发布日期时：

```Bash
# 1. 从 develop 切出发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0

# 2. 在发布分支上测试、修复Bug、调整版本号
git add .
git commit -m "chore: 调整版本号为 v1.0.0"

# 3. 测试通过后，合并到 main 并打Tag
git checkout main
git merge --no-ff release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"  # 打Tag标记版本
git push origin main
git push origin v1.0.0

# 4. 同时合并回 develop，确保修复的Bug同步到开发分支
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

# 5. 删除发布分支
git branch -d release/v1.0.0
```

#### 3. 热修复（Hotfix）

生产环境出现紧急Bug时：

```Bash
# 1. 从 main 切出热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/fix-crash

# 2. 修复Bug并提交
git add .
git commit -m "fix: 修复登录崩溃问题"

# 3. 修复完成后，合并到 main 并打Tag（如 v1.0.1）
git checkout main
git merge --no-ff hotfix/fix-crash
git tag -a v1.0.1 -m "Hotfix version 1.0.1"
git push origin main
git push origin v1.0.1

# 4. 同时合并回 develop（避免后续版本回归此Bug）
git checkout develop
git merge --no-ff hotfix/fix-crash
git push origin develop

# 5. 删除热修复分支
git branch -d hotfix/fix-crash
```

### 三、提交信息规范（Conventional Commits）

提交信息需严格遵循 **Conventional Commits** 规范，格式为：

`<type>(<scope>): <subject>`

- **type**（必填）：提交类型，如 `feat`（新功能）、`fix`（修复Bug）、`docs`（文档）、`style`（格式）、`refactor`（重构）、`test`（测试）、`chore`（构建/工具）。
    
- **scope**（可选）：影响范围，如 `login`、`order`。
    
- **subject**（必填）：简短描述，不超过50字符，以动词开头。
    

**示例**：

```Bash
git commit -m "feat(login): 增加短信验证码登录"
git commit -m "fix(order): 修复订单金额计算错误"
git commit -m "docs: 更新API文档"
```

### 四、常用Git命令速查

|场景|命令|
|---|---|
|克隆仓库|`git clone <仓库地址>`|
|查看所有分支|`git branch -a`（本地+远程）|
|切换分支|`git checkout <分支名>`|
|拉取远程代码|`git pull origin <分支名>`|
|推送本地代码|`git push origin <分支名>`|
|查看工作区状态|`git status`|
|查看提交历史|`git log --oneline`|
|暂存文件|`git add <文件名>` / `git add .`|
|撤销暂存|`git reset HEAD <文件名>`|
|撤销本地修改|`git checkout -- <文件名>`|
|合并分支|`git merge --no-ff <分支名>`|
|打Tag|`git tag -a <版本号> -m "描述"`|

### 五、团队协作注意事项

1. **禁止直接 push 到 main/develop**：所有合并需通过 Pull Request (PR) 进行，需至少1人审核。
    
2. **先 pull 再 push**：避免代码冲突，推送前务必拉取远程最新代码。
    
3. **小步提交**：每个提交只做一件事，便于回滚和代码审查。
    
4. **定期同步 develop**：功能分支开发期间，定期合并 `develop` 到当前分支，减少最终合并冲突。
    

需要我帮你生成一份**Git Flow 可视化流程图**，或者针对你的团队场景调整规范细节吗？