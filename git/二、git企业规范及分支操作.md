# Git命令规范和分支操作流程
适用于企业开发的 **Git 命令规范** 和 **分支操作流程**，业界主流的 **Git Flow** 工作流，确保团队协作高效、代码历史清晰，补充初始化与克隆相关操作，覆盖完整开发流程。
# 一、Git 初始化与仓库克隆（基础操作）
企业开发中，分为“新建本地仓库并关联远程”和“直接克隆远程仓库”两种场景，操作规范如下：
## 1. 本地仓库初始化（新建项目场景）
当项目从零开始，需先创建本地仓库，再关联企业远程仓库（如GitLab、GitHub、Gitee企业版）：
```bash
# 1. 进入项目根目录（本地新建文件夹后进入）
cd /path/to/your/project

# 2. 初始化本地Git仓库（生成.git隐藏目录，管理版本记录）
git init

# 3. 关联企业远程仓库（remote地址从企业代码仓库复制，通常为HTTPS或SSH协议）
git remote add origin <企业远程仓库地址>

# 4. 查看远程关联是否成功（确认origin对应正确的远程仓库地址）
git remote -v

# 5. 首次提交本地初始代码（如README、项目配置文件）
git add .
git commit -m "chore: 初始化项目，添加基础配置文件"

# 6. 推送本地master/main分支到远程（首次推送需指定-u关联远程分支）
git push -u origin main  # 若远程默认分支为master，替换为master
```
## 2. 远程仓库克隆（加入已有项目场景）
当加入已有项目时，直接克隆远程仓库到本地，无需手动初始化，步骤如下：
```bash
# 1. 克隆远程仓库（默认克隆所有分支，本地生成与远程一致的目录结构）
git clone <企业远程仓库地址>

# 2. 进入克隆后的项目目录
cd <克隆后的项目文件夹名>

# 3. 查看本地分支（默认处于main/master分支，需切换到develop分支进行开发）
git branch
git checkout develop  # 切换到开发分支，确保基于最新开发代码工作
git pull origin develop  # 拉取远程develop分支最新代码，避免遗漏更新
```

# 二、分支管理规范（Git Flow 模型）
企业开发推荐采用 **Git Flow** 工作流，通过明确分支职责实现多版本并行开发与稳定发布。

| 分支类型      | 命名规范                                  | 作用                | 生命周期    |
| --------- | ------------------------------------- | ----------------- | ------- |
| **主分支**   | `main` / `master`                     | 生产环境代码，始终保持稳定可发布  | 长期存在    |
| **开发分支**  | `develop`                             | 功能集成分支，所有新功能开发的基础 | 长期存在    |
| **功能分支**  | `feature/xxx`（如 `feature/user-login`） | 开发新功能             | 开发完成后删除 |
| **发布分支**  | `release/xxx`（如 `release/v1.0.0`）     | 发布前测试、Bug修复、版本号调整 | 发布完成后删除 |
| **热修复分支** | `hotfix/xxx`（如 `hotfix/fix-crash`）    | 紧急修复生产环境Bug       | 修复完成后删除 |

# 三、核心分支操作流程
## 1. 功能开发（Feature）
```bash
# 1. 从 develop 切出功能分支（确保本地develop分支最新）
git checkout develop
git pull origin develop
git checkout -b feature/user-login

# 2. 开发过程中频繁提交（小步提交，便于回滚，遵循提交信息规范）
git add .
git commit -m "feat(login): 完成用户登录界面布局"

# 3. 开发完成后，合并回 develop
git checkout develop
git pull origin develop  # 先拉取远程最新代码，避免冲突
git merge --no-ff feature/user-login  # --no-ff 保留分支历史，便于追溯
git push origin develop

# 4. 删除本地功能分支（远程分支可通过PR合并后删除）
git branch -d feature/user-login
```
## 2. 发布准备（Release）
当 `develop` 积累足够功能或到达发布日期时：
```bash
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
git tag -a v1.0.0 -m "Release version 1.0.0"  # 打Tag标记版本，便于后续追溯
git push origin main
git push origin v1.0.0

# 4. 同时合并回 develop，确保修复的Bug同步到开发分支
git checkout develop
git merge --no-ff release/v1.0.0
git push origin develop

# 5. 删除发布分支
git branch -d release/v1.0.0
```
## 3. 热修复（Hotfix）
生产环境出现紧急Bug时，优先从主分支切出热修复分支，快速修复并发布：
```bash
# 1. 从 main 切出热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/fix-crash

# 2. 修复Bug并提交（提交信息注明修复内容，便于审查）
git add .
git commit -m "fix: 修复登录崩溃问题"

# 3. 修复完成后，合并到 main 并打Tag（版本号递增，如 v1.0.1）
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
# 四、提交信息规范（Conventional Commits）
提交信息需严格遵循 **Conventional Commits** 规范，格式统一，便于代码追溯和自动化版本管理，格式为：
`<type>(<scope>): <subject>`
说明：
- **type**（必填）：提交类型，核心类型如下：
    
    - `feat`：新功能开发
        
    - `fix`：Bug修复
        
    - `docs`：文档更新（如API文档、说明文档）
        
    - `style`：代码格式调整（不影响代码逻辑）
        
    - `refactor`：代码重构（既不新增功能，也不修复Bug）
        
    - `test`：添加/修改测试用例
        
    - `chore`：构建、工具相关操作（如版本号调整、依赖更新）
        
- **scope**（可选）：影响范围，如 `login`（登录模块）、`order`（订单模块），明确提交影响的业务模块
- **subject**（必填）：简短描述，不超过50字符，以动词开头，避免模糊表述
**示例**：

```bash
git commit -m "feat(login): 增加短信验证码登录功能"
git commit -m "fix(order): 修复订单金额计算错误（兼容负数金额）"
git commit -m "docs: 更新用户中心API文档"
git commit -m "chore: 升级依赖包至最新稳定版"
```

# 五、常用Git命令速查（企业开发高频）

|应用场景|Git命令|补充说明|
|---|---|---|
|克隆远程仓库|`git clone <仓库地址>`|默认克隆所有分支，直接关联远程origin|
|初始化本地仓库|`git init`|新建项目时使用，需后续关联远程仓库|
|关联远程仓库|`git remote add origin <仓库地址>`|查看关联：`git remote -v`；删除关联：`git remote rm origin`|
|查看所有分支|`git branch -a`|显示本地（无前缀）和远程（remotes/origin/前缀）所有分支|
|切换分支|`git checkout <分支名>` / `git switch <分支名>`|新建并切换：`git checkout -b <分支名>`|
|拉取远程代码|`git pull origin <分支名>`|等价于 `git fetch + git merge`，拉取并合并远程最新代码|
|推送本地代码|`git push origin <分支名>`|首次推送：`git push -u origin <分支名>`（关联本地与远程分支）|
|查看工作区状态|`git status`|查看未暂存、已暂存的文件，提示当前分支状态|
|查看提交历史|`git log --oneline`|简洁显示提交记录，每行一个提交ID和描述|
|暂存文件|`git add <文件名>` / `git add .`|`git add .` 暂存所有修改、新增文件（不包括删除文件）|
|撤销暂存|`git reset HEAD <文件名>`|将已暂存的文件退回至未暂存状态|
|撤销本地修改|`git checkout -- <文件名>`|未暂存的修改会被撤销，无法恢复，谨慎使用|
|合并分支|`git merge --no-ff <分支名>`|`--no-ff` 保留分支合并记录，便于追溯代码来源|
|打版本Tag|`git tag -a <版本号> -m "描述"`|推送Tag到远程：`git push origin <版本号>`|

# 六、团队协作注意事项

1. **禁止直接 push 到 main/develop**：所有代码合并需通过 Pull Request (PR) 进行，需至少1名团队成员审核通过后，方可合并，避免误操作污染核心分支。
    
2. **先 pull 再 push**：推送代码前，务必拉取远程对应分支的最新代码，解决冲突后再推送，避免代码覆盖或冲突无法解决。
    
3. **小步提交**：每个提交只完成一件事（如一个小功能、一个Bug修复），提交信息清晰，便于后续回滚、代码审查和问题定位。
    
4. **定期同步 develop**：功能分支开发周期较长时，需定期（如每日下班前）合并 `develop` 分支到当前功能分支，减少最终合并时的冲突量。
    
5. **分支命名规范**：严格遵循分支命名规则，禁止使用随意命名（如 `test123`、`mybranch`），确保团队成员能快速识别分支用途。
    
6. **及时删除无用分支**：功能分支、发布分支、热修复分支完成合并后，及时删除本地和远程分支，避免分支冗余，影响团队协作效率。