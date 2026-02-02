# GitHub 上傳與發佈指南

## 為什麼推薦 Vercel 而不是直接用 GitHub Pages？
雖然 **GitHub Pages** 也可以發佈網頁，但對於像我們這種 **React (Vite) 應用程式**，Vercel 有幾個顯著優勢：

1.  **路由設定 (Routing)**：React 是單頁應用 (SPA)，在 GitHub Pages 上如果使用者在非首頁重整 (例如 `/result`)，會出現 404 錯誤，需要額外設定或是改用 HashRouter (網址會變醜，如 `/#/result`)。Vercel 則會自動處理這個問題。
2.  **環境變數安全**：GitHub Pages 是純靜態託管。雖然 Vercel 也是前端，但在 Vercel 後台設定 Environment Variables 非常直觀，且部署流程對現代框架 (Vite/Next.js) 的支援度最好，幾乎是「零設定」。
3.  **自動化部署**：Vercel 只要連結了 GitHub，你以後每次 push 程式碼，它就會自動幫你重新打包發佈，不用自己手動跑 build 指令。

---

## 如何將專案上傳到 GitHub

您需要先在 GitHub 網站上建立一個倉庫，然後在電腦上執行以下指令。

### 1. 在 GitHub 建立 Repository
1.  登入 [GitHub](https://github.com)。
2.  點擊右上角 "+" -> **New repository**。
3.  輸入 Repository name (例如 `plant-health-app`)。
4.  選擇 **Public** (公開) 或 **Private** (私有)。
    *   *注意：如果是免費版 GitHub，Public 倉庫才能免費用 GitHub Pages (若您堅持想用的話)。*
5.  點擊 **Create repository**。

### 2. 在本機執行 Git 指令
請打開 VS Code 的終端機 (Terminal)，依序執行以下指令：

```bash
# 1. 初始化 Git 設定
git init

# 2. 將所有檔案加入暫存區
git add .

# 3. 提交第一次版本
git commit -m "Initial launch of Plant Health App"

# 4. 重新命名主分支為 main
git branch -M main

# 5.連結遠端倉庫 (請將下方的 URL 換成您剛剛在 GitHub 建立的網址)
git remote add origin https://github.com/您的帳號/plant-health-app.git

# 6. 推送程式碼
git push -u origin main
```

---

## 如果您堅持要用 GitHub Pages 發佈

如果您不想用 Vercel，想直接用 GitHub Pages，也是可以的！但步驟稍微多一點：

1.  開啟 `vite.config.js`，新增 `base` 設定：
    ```javascript
    export default defineConfig({
      base: '/plant-health-app/', // 必須換成您的 repo 名稱
      plugins: [react()],
      // ...
    })
    ```
2.  安裝部署工具：`npm install gh-pages --save-dev`
3.  在 `package.json` 的 `scripts` 加入：
    ```json
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
    ```
4.  執行 `npm run deploy`。

**比較起來，Vercel 只需要「連結 GitHub」這一步就全自動完成了，不需要修改程式碼或設定檔，所以對新手最友善！**
