# 如何發佈您的植物識別 App

恭喜您完成了 App 開發！若要將這個 App 發佈到網路上讓朋友使用，推薦使用 **Vercel** 或 **Netlify**，這兩者都是免費且支援 React/Vite 最好的平台。

以下是使用 **Vercel** 發佈的步驟：

## 1. 準備工作 (將程式碼上傳至 GitHub)
發佈最簡單的方式是將您的程式碼上傳到 GitHub。
1. 在 GitHub 上建立一個新的 Repository (倉庫)。
2. 在您的電腦上執行 git 指令將程式碼推送到 GitHub：
   ```bash
   git init
   git add .
   git commit -m "First commit"
   git branch -M main
   # 將下方 URL 換成您剛建立的 GitHub 網址
   git remote add origin https://github.com/您的帳號/repo名稱.git
   git push -u origin main
   ```

## 2. 在 Vercel 進行部署
1. 前往 [Vercel 官網](https://vercel.com) 並註冊/登入 (可直接用 GitHub 帳號登入)。
2. 點擊 **"Add New..."** -> **"Project"**。
3. 在 "Import Git Repository" 列表中找到您剛剛上傳的專案，點擊 **"Import"**。
4. **關鍵步驟：設定環境變數 (Environment Variables)**
   - 在設定頁面中找到 **"Environment Variables"** 展開它。
   - Key 輸入：`VITE_GEMINI_API_KEY`
   - Value 輸入：您的 Google Gemini API Key (以 AIza 開頭的那串)。
   - 點擊 **"Add"**。
5. 點擊 **"Deploy"** 按鈕。

等待約 1 分鐘，Vercel 就會給您一個專屬網址 (例如：`plant-health-app.vercel.app`)，您可以將這個網址分享給手機或朋友使用！

---

## ⚠️ 重要安全注意事項

由於這是一個純前端網頁應用 (Single Page Application)，您的 API Key 在技術上會被打包在程式碼中傳送給使用者。

為了防止他人盜用您的 Key，**強烈建議**您執行以下安全設定：

1. 前往 [Google AI Studio / Google Cloud Console](https://console.cloud.google.com/apis/credentials)。
2. 找到您的 API Key。
3. 在 **"Application restrictions" (應用程式限制)** 中選擇 **"Web sites (HTTP referrers)"**。
4. 在 **"Website restrictions"** 中加入您剛剛獲得的 Vercel 網址 (例如：`https://plant-health-app.vercel.app/*`)。
5. 儲存設定。

這樣一來，只有從您的網址發出的請求會被接受，其他人就算拿到了 Key 也無法在別的地方使用。
