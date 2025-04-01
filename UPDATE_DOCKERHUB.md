# 更新DockerHub镜像指南

当项目代码更新后，您需要更新DockerHub上的镜像以反映最新的变更。以下是两种更新DockerHub镜像的方法：通过GitHub Actions自动更新和手动更新。

## 方法一：通过GitHub Actions自动更新（推荐）

项目已配置GitHub Actions工作流，可以在代码推送到主分支或创建新标签时自动构建并推送Docker镜像到DockerHub。

### 前提条件

1. 确保已在GitHub仓库设置中添加以下密钥：
   - `DOCKERHUB_USERNAME`: 您的DockerHub用户名
   - `DOCKERHUB_TOKEN`: 您的DockerHub访问令牌（不是密码）

### 自动更新步骤

1. **提交并推送代码到主分支**
   ```bash
   git add .
   git commit -m "更新内容：简要描述您的更改"
   git push origin main
   ```

2. **或者，创建并推送新标签（用于发布版本）**
   ```bash
   git tag v1.0.1  # 根据语义化版本规范增加版本号
   git push origin v1.0.1
   ```

3. **监控GitHub Actions工作流**
   - 访问GitHub仓库的Actions标签页查看构建进度
   - 构建成功后，镜像将自动推送到DockerHub

## 方法二：手动构建和推送

如果您需要在本地测试或者GitHub Actions不可用，可以手动构建和推送镜像。

### 前提条件

1. 安装Docker（已安装，当前版本：Docker version 28.0.1）
2. 登录到DockerHub

### 手动更新步骤

1. **登录到DockerHub**
   ```bash
   docker login
   # 输入您的DockerHub用户名和密码或访问令牌
   ```

2. **使用docker-compose构建镜像**
   ```bash
   # 设置环境变量（替换为您的DockerHub用户名）
   export DOCKER_USERNAME=yourusername
   export TAG=latest  # 或指定版本号，如v1.0.1
   
   # 构建镜像
   docker-compose build
   ```

3. **或者，直接使用Docker命令构建镜像**
   ```bash
   docker build -t yourusername/mermaid-to-image:latest .
   ```

4. **推送镜像到DockerHub**
   ```bash
   docker push yourusername/mermaid-to-image:latest
   # 如果使用了特定标签，请相应地更改命令
   # docker push yourusername/mermaid-to-image:v1.0.1
   ```

## 验证更新

1. 访问您的DockerHub仓库页面，确认新镜像已成功推送
2. 可以在本地或服务器上拉取并运行新镜像进行测试：
   ```bash
   docker pull yourusername/mermaid-to-image:latest
   docker run -p 8080:80 yourusername/mermaid-to-image:latest
   ```
3. 在浏览器中访问 `http://localhost:8080` 验证应用是否正常运行

## 注意事项

- 确保在推送代码前已完成所有必要的测试
- 保持DockerHub访问令牌的安全，定期更新
- 考虑使用语义化版本规范来管理镜像版本
- 如果您的DockerHub仓库是私有的，确保有权限的用户能够访问