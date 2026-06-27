# 📱 Google Play Store Android Deployment Guide (Hindi/English)

Exam Escape ko Google Play Store par live karne ke liye 2 sabse aasan aur reliable tarike hain:

---

## 🚀 Option 1: Google Bubblewrap (Recommended — Sabse Aasan & Fast)
**Bubblewrap** Google ka official tool hai jo kisi bhi standard PWA (Progressive Web App) ko bina Android Studio ya Java coding ke direct signed Android App Bundle (`.aab`) aur `.apk` me compile kar deta hai.

### Prerequisites (Zaroorat):
1. Aapka game backend (Render/Railway par) aur frontend (Netlify/Vercel/GitHub Pages par) live hona chahiye aur uska HTTPS link chal raha ho.
2. Local Node.js installed hona chahiye.

### Steps:
1. **Bubblewrap CLI Install Karein**:
   Apne computer ke cmd me run karein:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. **Project Initialize Karein**:
   Apne live game website ka manifest check karke init command run karein:
   ```bash
   bubblewrap init --manifest=https://your-deployed-game-url.com/manifest.json
   ```
   *Note: Bubblewrap automatically SDKs download karne ki permission mangega, use yes (`y`) karein.*
3. **App Details Fill Karein**:
   Command prompt aapse detail pucha (Application Name, Package ID e.g., `com.examescape.game`, status bar colors, etc.). Default enter dabate jayein.
4. **App Build Karein**:
   Build start karne ke liye run karein:
   ```bash
   bubblewrap build
   ```
   - Build ke time, Bubblewrap aapse **Keystore password** aur credentials set karne ko kahega. Ye details securely note kar lein kyunki update nikalne ke liye ye keystore mandatory hai.
   - Build complete hone par, aapko `./app-release-bundle.aab` aur `.apk` files output folder me mil jayengi.
   - **`.aab` (Android App Bundle)** file ko aap direct Google Play Console par upload kar sakte hain!

---

## 🛠️ Option 2: Capacitor Wrap (Full Native App Wrapper)
Agar aap isme offline levels, Google Play Services Login, Leaderboards, ya ads add karna chahte hain, toh **Capacitor** native shell build karne ka best option hai.

### Steps:
1. **Packages Install Karein**:
   Apne workspace terminal me dependencies install karein:
   ```bash
   # package.json dependencies setup
   cmd.exe /c npm install
   ```
2. **Frontend Build Karein**:
   Game assets ko `www/` build folder me copy karne ke liye humara customized node script run karein:
   ```bash
   npm run build
   ```
3. **Capacitor Init & Configure Karein**:
   ```bash
   npm run cap:init
   ```
   *Ye aapse App name ("Exam Escape") aur Package ID ("com.examescape.game") mangega.*
4. **Android Platform Add Karein**:
   ```bash
   npm run cap:add-android
   ```
   *Isse project directory me ek full-fledged `android/` source code folder create ho jayega.*
5. **Assets Sync Karein**:
   Sync command run karein jab bhi code update ho:
   ```bash
   npm run cap:sync
   ```
6. **Android Studio me Project Open Karein**:
   ```bash
   npx cap open android
   ```
7. **Generate Signed App Bundle (`.aab`)**:
   - Android Studio open hone ke baad, dependencies indexing hone dein.
   - Top menu me **Build > Generate Signed Bundle / APK** par click karein.
   - **Android App Bundle** select karke **Next** karein.
   - **Create New Keystore** par click karke key generate karein (Password aur name yaad rakhein).
   - Destination folder select karein aur **release** build select karke **Finish** karein.
   - Aapka `.aab` file ready ho jayega jo Play Store ke liye accepted format hai!

---

## 📝 Play Store Submission Checklist (Kya-kya chahiye?)
Google Play Console par app submit karte waqt in cheezon ki zaroorat hogi:
1. **Google Play Developer Account**: Ek baar ki fees ($25 USD) lagti hai registry ke liye.
2. **Privacy Policy URL**: Ek simple Google Doc ya GitHub Page par text privacy policy page banayein (declare karein ki leaderboard save karne ke liye hum baseline "player name" store karte hain).
3. **Store Listing Assets**:
   - App Icon: 512x512 PNG.
   - Feature Graphic: 1024x500 PNG.
   - Phone Screenshots: Kam se kam 2-4 screenshots (aap browser simulator se capture kar sakte hain).
4. **Data Safety**:
   - Form fill karte waqt declare karein: "We collect user Name and Score (optional / user-provided) for game leaderboard display, transmitted securely over HTTPS, and user can request deletion."
