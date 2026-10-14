# Cyber Security Assessment and Protection System

> **"Learn Cybersecurity. Understand Threats. Improve Protection."**

A beginner-friendly, interactive cybersecurity college project created for a Computer Engineering **Cyber Security** course.

---

## 1. Project Overview

The **Cyber Security Assessment and Protection System** is an easy-to-understand, browser-based cybersecurity tool developed for engineering students. Instead of being just a textbook website, the system provides practical, interactive tools to help students and users understand basic security scanning:

1. **Basic File & Malware Scanner:** Upload any file from your computer to calculate its cryptographic SHA-256 hash, inspect file extensions, detect suspicious script execution patterns, and detect standard virus test signatures (EICAR).
2. **Computer & Browser Security Check:** Automatically audits the user's browser environment for HTTPS encryption, cookie protection, Do Not Track privacy, and client platform properties.
3. **Password Strength & Brute-Force Checker:** Computes password entropy and estimates crack times across online and offline attack scenarios.
4. **Personal Computer Security Assessment:** An interactive 10-question evaluation that calculates a clear 100-point security posture score with actionable recommendations.
5. **Cybersecurity Challenge Quiz:** 25 multiple-choice questions covering core cybersecurity topics with instant correct/incorrect feedback and detailed explanations.
6. **Security Awareness Scenarios:** 5 interactive real-world incident simulations (phishing email, lost USB drive, tailgating, public Wi-Fi, and fake password-reset calls).

---

## 2. Technologies Used

Built with standard, beginner-friendly web technologies:
- **HTML5:** Semantic document structure, accessible input forms, and drag-and-drop file API.
- **CSS3:** Clean dark command center design (`#070d18`, `#0f172a`), responsive grid layout, and badges.
- **Vanilla JavaScript (ES6+):** Pure client-side logic for file reading, SHA-256 hash calculation (`crypto.subtle`), scoring algorithms, and quiz evaluation.
- **Zero External Frameworks:** No React, Node.js, Python, or external databases required.

---

## 3. Project Folder Structure

```
cyber-security-system/
│
├── index.html              # Main application with scanner, system check, assessment, quiz
├── style.css               # Styling, dark cyber theme, and responsive layouts
├── script.js               # Interactive JavaScript logic for all scanning tools and quiz
├── host-server.bat         # Windows one-click local server launcher
├── host-server.ps1         # Built-in PowerShell HTTP server script
├── open-website.bat        # Direct browser launch shortcut (no server needed)
├── README.md               # Project documentation and guide
└── project-report.md       # Complete 15-chapter academic college project report
```

---

## 4. How to Run the Website

### Method 1: Direct Launch (Simplest)
1. Navigate to:
   ```
   C:\Users\Tanish Waykar\.gemini\antigravity\scratch\cyber-security-system\
   ```
2. Double-click **`open-website.bat`** (or simply double-click **`index.html`**).
3. The website opens directly in your default browser (Chrome, Edge, Firefox).

### Method 2: Local Web Server
1. Inside the folder, double-click **`host-server.bat`**.
2. Keep the command window open. It will launch the site at:
   ```
   http://localhost:8000/
   ```

### Method 3: VS Code Live Server
1. Open the folder in **Visual Studio Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.

---

## 5. Working Features

- **File Scanner:**
  - Drag-and-drop any file or click "Choose File".
  - Shows animated scanning progress bar.
  - Computes real SHA-256 hash in browser.
  - Detects standard EICAR test virus strings and flags them with high-priority warnings.
  - Detects deceptive double extensions (e.g. `document.pdf.exe`).
  - Provides sample test buttons for quick classroom demonstration.
- **System Check:**
  - Audits HTTPS encryption context, cookie isolation, and Do Not Track headers.
  - One-click "Re-Scan System Parameters" button.
- **Password Auditor:**
  - Live entropy calculator and crack time estimator (online vs offline).
  - 5 criteria checklist pills with instant pass/fail indicators.
  - "Random Strong" password generator.
- **Security Assessment:**
  - 10 practical questions (firewall, updates, passwords, backups, etc.).
  - 100-point transparent score with personalized recommendations.
- **Cyber Quiz:**
  - 25 multiple-choice questions with instant green/red highlighting.
  - Detailed explanation card for every question.
  - Final results card with percentage grade.
- **Awareness Scenarios:**
  - 5 interactive simulations with instant safety evaluation.

---

## 6. Academic College Report

A complete 15-chapter academic project report formatted for Computer Engineering course submissions is available in:
[`project-report.md`](project-report.md)
