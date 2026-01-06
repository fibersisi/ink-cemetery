# 如何部署您的应用到 Internet

您的应用是一个基于 Vite 和 Three.js 的静态网站，部署非常简单。我已经为您完成了生产环境构建（生成在大约 `dist` 文件夹中）。

以下是推荐的部署方式：

## 方式一：最快速（Netlify Drop）
这种方式不需要配置 GitHub，只需几秒钟即可上线预览。

1.  **找到构建文件**：
    在您的电脑上打开文件夹：`d:\Practise\anti-1\dist`
    *(注意：是 `dist` 文件夹，不是整个项目文件夹)*

2.  **上传**：
    打开浏览器访问 [Netlify Drop](https://app.netlify.com/drop)。
    将 `dist` 文件夹直接拖拽到页面上的虚线框区域。

3.  **完成**：
    等待几秒钟，Netlify 会生成一个随机域名的网址（例如 `romantic-wing-12345.netlify.app`），您可以立即访问并分享。

---

## 方式二：GitHub Pages (已为您配置好脚本)
这是最标准的部署方式，适合开源项目或个人展示。

### 第一步：配置项目路径
1.  **打开项目中的 `vite.config.js` 文件**。
2.  找到 `base: '/your-repo-name/'` 这一行。
3.  将 `'your-repo-name'` 修改为您在 GitHub 上创建的仓库名称。
    *   例如：如果您的仓库是 `https://github.com/fibersisi/ink-cemetery`，则改为 `base: '/ink-cemetery/'`。

### 第二步：创建仓库并推送代码
1.  在 GitHub 上创建一个新仓库（不要勾选 Initialize with README）。
2.  在 VS Code 终端中运行以下命令关联远程仓库（替换 URL）：
    ```bash
    git remote add origin https://github.com/fibersisi/ink-cemetery.git
    git branch -M main
    git add .
    git commit -m "Initial commit"
    git push -u origin main
    ```

### 第三步：一键部署
只需在终端运行以下命令：
```bash
npm run deploy
```

这个命令会自动执行以下操作：
1.  重新构建项目（`npm run build`）。
2.  将 `dist` 文件夹的内容推送到 GitHub 的 `gh-pages` 分支。
3.  您的网站将在 `https://您的用户名.github.io/您的仓库名/` 上线（可能需要几分钟生效）。

https://fibersisi.github.io/ink-cemetery/

---

## 方式三：Vercel (最推荐，自动更新)
Vercel 对 Vite 项目支持极好，且不需要手动更改 `base` 路径。

1.  **提交代码到 GitHub**（同上，完成第二步即可）。
2.  访问 [Vercel.com](https://vercel.com) 并使用 GitHub 登录。
3.  点击 "Add New..." -> "Project"。
4.  导入您的 GitHub 仓库。
5.  **关键设置**：保持默认即可，Vite 框架会被自动识别。
6.  点击 "Deploy"。
