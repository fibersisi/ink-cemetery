import { defineConfig } from 'vite'

export default defineConfig({
    // 重要：将 'your-repo-name' 替换为您的 GitHub 仓库名称
    // 例如，如果您的仓库 URL 是 https://github.com/john/my-project
    // 那么这里应该是 base: '/my-project/'
    // 如果您部署到 https://yourname.github.io/ (用户网站)，则保持 '/'
    base: '/ink-cemetery/',
    build: {
        outDir: 'dist',
    }
})
