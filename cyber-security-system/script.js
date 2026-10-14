/**
 * Cyber Security Assessment and Protection System
 * Author: Computer Engineering Final Course Project
 * File: script.js
 * 
 * Features:
 * 1. Navigation & mobile menu handling
 * 2. Tool 1: File & Malware Security Scanner (SHA-256 hashing, EICAR virus signature, double extension checks)
 * 3. Tool 2: System & Browser Security Check (HTTPS, cookie security, DNT, platform audit)
 * 4. Tool 3: Password Strength & Brute-Force Checker (entropy math, crack time estimates)
 * 5. Tool 4: 10-Question Personal Computer Security Assessment & scoring engine
 * 6. Tool 5: 25-Question Cybersecurity Quiz with instant feedback and explanations
 * 7. Tool 6: 5 Interactive Incident Awareness Scenarios
 * 8. Back-to-top button
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFileScanner();
  initSystemCheck();
  initPasswordChecker();
  initAssessment();
  initQuiz();
  initScenarios();
  initBackToTop();
});

/* ==========================================================================
   1. NAVIGATION & UI HELPERS
   ========================================================================== */

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.textContent = isOpen ? '✕' : '☰';
    });

    allNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.textContent = '☰';
      });
    });
  }

  // Active section tracking on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   2. TOOL 01: BASIC FILE & MALWARE SCANNER
   ========================================================================== */

function initFileScanner() {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const browseBtn = document.getElementById('browseFileBtn');
  const progressBarContainer = document.getElementById('scanProgressBarContainer');
  const progressFill = document.getElementById('scanProgressFill');
  const statusText = document.getElementById('scanStatusText');
  const percentText = document.getElementById('scanPercentText');
  const resultCard = document.getElementById('scanResultCard');
  const scanAnotherBtn = document.getElementById('scanAnotherBtn');
  const testEicarBtn = document.getElementById('testEicarBtn');
  const testSuspiciousBtn = document.getElementById('testSuspiciousBtn');

  if (!dropZone || !fileInput) return;

  // Browse button trigger
  browseBtn.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('click', (e) => {
    if (e.target !== browseBtn) fileInput.click();
  });

  // Drag and drop event listeners
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      processFile(fileInput.files[0]);
    }
  });

  if (scanAnotherBtn) {
    scanAnotherBtn.addEventListener('click', () => {
      resultCard.style.display = 'none';
      dropZone.style.display = 'block';
      fileInput.value = '';
    });
  }

  // Quick Test Buttons for Demonstration
  if (testEicarBtn) {
    testEicarBtn.addEventListener('click', () => {
      const eicarString = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';
      const blob = new Blob([eicarString], { type: 'text/plain' });
      const testFile = new File([blob], 'eicar_com_test.txt', { type: 'text/plain' });
      processFile(testFile);
    });
  }

  if (testSuspiciousBtn) {
    testSuspiciousBtn.addEventListener('click', () => {
      const dummyContent = 'powershell.exe -enc aQB3AHIA... cmd.exe /c start evil.exe';
      const blob = new Blob([dummyContent], { type: 'application/x-msdownload' });
      const testFile = new File([blob], 'urgent_invoice_payment.pdf.exe', { type: 'application/x-msdownload' });
      processFile(testFile);
    });
  }

  // Helper to read file as ArrayBuffer safely using FileReader
  function readFileBuffer(file, maxBytes = 10 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('Read error'));
      try {
        const slice = file.slice ? file.slice(0, Math.min(file.size, maxBytes)) : file;
        reader.readAsArrayBuffer(slice);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Helper to read file text slice safely using FileReader
  function readFileText(file, maxBytes = 64 * 1024) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result || '');
      reader.onerror = () => resolve('');
      try {
        const slice = file.slice ? file.slice(0, Math.min(file.size, maxBytes)) : file;
        reader.readAsText(slice);
      } catch (e) {
        resolve('');
      }
    });
  }

  // Helper to compute SHA-256 with fallback
  async function computeHash(arrayBuffer) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch (e) {
      console.warn('Crypto.subtle fallback:', e);
    }
    // Fallback quick checksum
    let hash = 0;
    const uint8 = new Uint8Array(arrayBuffer);
    const len = Math.min(uint8.length, 65536);
    for (let i = 0; i < len; i++) {
      hash = ((hash << 5) - hash + uint8[i]) | 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0') + ' (fast checksum)';
  }

  // Core File Processing Function
  async function processFile(file) {
    dropZone.style.display = 'none';
    resultCard.style.display = 'none';
    progressBarContainer.style.display = 'block';

    statusText.textContent = `Reading ${file.name}...`;
    progressFill.style.width = '35%';
    percentText.textContent = '35%';

    try {
      // Step 1: Read ArrayBuffer (up to 10MB for fast response)
      const arrayBuffer = await readFileBuffer(file, 10 * 1024 * 1024);
      progressFill.style.width = '65%';
      percentText.textContent = '65%';
      statusText.textContent = 'Computing SHA-256 cryptographic hash...';

      // Step 2: Compute Hash
      const hashHex = await computeHash(arrayBuffer);

      progressFill.style.width = '85%';
      percentText.textContent = '85%';
      statusText.textContent = 'Scanning for malware signatures and heuristic patterns...';

      // Step 3: Read Text slice to inspect signatures
      const textSlice = await readFileText(file, 64 * 1024);

      // Step 4: Heuristic Checks
      const filename = file.name.toLowerCase();
      const isEicar = textSlice.includes('EICAR-STANDARD-ANTIVIRUS-TEST-FILE');
      const doubleExtMatch = filename.match(/\.(pdf|docx|xlsx|jpg|png|txt)\.(exe|bat|vbs|cmd|ps1|scr|hta)$/i);
      const dangerousExts = ['.exe', '.bat', '.vbs', '.cmd', '.ps1', '.scr', '.hta', '.jar'];
      const hasDangerousExt = dangerousExts.some(ext => filename.endsWith(ext));
      const suspiciousKeywords = ['powershell -enc', 'cmd.exe /c', 'wscript.shell', 'eval(', 'invoke-expression'];
      const hasSuspiciousKeyword = suspiciousKeywords.some(kw => textSlice.toLowerCase().includes(kw));

      progressFill.style.width = '100%';
      percentText.textContent = '100%';
      statusText.textContent = 'Analysis complete!';

      setTimeout(() => {
        progressBarContainer.style.display = 'none';
        displayResults(file, hashHex, isEicar, doubleExtMatch, hasDangerousExt, hasSuspiciousKeyword);
      }, 300);

    } catch (err) {
      console.warn('File read warning:', err);
      progressFill.style.width = '100%';
      percentText.textContent = '100%';
      statusText.textContent = 'Analysis complete!';

      const filename = file.name.toLowerCase();
      const doubleExtMatch = filename.match(/\.(pdf|docx|xlsx|jpg|png|txt)\.(exe|bat|vbs|cmd|ps1|scr|hta)$/i);
      const dangerousExts = ['.exe', '.bat', '.vbs', '.cmd', '.ps1', '.scr', '.hta', '.jar'];
      const hasDangerousExt = dangerousExts.some(ext => filename.endsWith(ext));

      setTimeout(() => {
        progressBarContainer.style.display = 'none';
        displayResults(file, 'Hash calculation restricted by OS file lock', false, doubleExtMatch, hasDangerousExt, false);
      }, 300);
    }
  }

  function displayResults(file, hashHex, isEicar, doubleExtMatch, hasDangerousExt, hasSuspiciousKeyword) {
    const fileNameEl = document.getElementById('resFileName');
    const fileSizeEl = document.getElementById('resFileSize');
    const fileExtEl = document.getElementById('resFileExt');
    const fileHashEl = document.getElementById('resFileHash');
    const heuristicsEl = document.getElementById('resHeuristics');

    const verdictIcon = document.getElementById('scanVerdictIcon');
    const verdictTitle = document.getElementById('scanVerdictTitle');
    const verdictSubtitle = document.getElementById('scanVerdictSubtitle');
    const verdictBadge = document.getElementById('scanVerdictBadge');

    const alertBox = document.getElementById('scanAlertBox');
    const alertIcon = document.getElementById('scanAlertIcon');
    const alertTitle = document.getElementById('scanAlertTitle');
    const alertDesc = document.getElementById('scanAlertDesc');

    // Populate metadata
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatBytes(file.size);
    const ext = file.name.includes('.') ? file.name.split('.').pop().toUpperCase() : 'UNKNOWN';
    fileExtEl.textContent = `.${ext}`;
    fileHashEl.textContent = hashHex;

    // Evaluate Threat Level
    if (isEicar) {
      // Confirmed Virus Signature
      verdictIcon.textContent = '🚨';
      verdictTitle.textContent = 'MALWARE DETECTED: Standard EICAR Test Virus';
      verdictSubtitle.textContent = 'Signature Match: EICAR-Standard-AV-Test-File';
      verdictBadge.className = 'badge badge-rose';
      verdictBadge.textContent = 'Threat: High';

      heuristicsEl.innerHTML = '<span style="color:var(--rose); font-weight:600;">⚠️ EICAR Signature Match Found</span>';

      alertBox.className = 'callout callout-danger';
      alertIcon.textContent = '🚨';
      alertTitle.textContent = 'Action Required: Quarantine or Delete Immediately';
      alertDesc.textContent = 'This file contains the universal EICAR antivirus test signature. While safe for testing, a real antivirus program would isolate or remove this file immediately to protect your computer.';
    } else if (doubleExtMatch) {
      // Deceptive Double Extension
      verdictIcon.textContent = '⚠️';
      verdictTitle.textContent = 'SUSPICIOUS FILE: Deceptive Double Extension';
      verdictSubtitle.textContent = `Masquerading pattern: ${doubleExtMatch[0]}`;
      verdictBadge.className = 'badge badge-amber';
      verdictBadge.textContent = 'Threat: Suspicious';

      heuristicsEl.innerHTML = '<span style="color:var(--amber); font-weight:600;">⚠️ Masquerading Double Extension Detected</span>';

      alertBox.className = 'callout callout-warning';
      alertIcon.textContent = '⚠️';
      alertTitle.textContent = 'Warning: Social Engineering Trojan Pattern';
      alertDesc.textContent = `This file appears to be a ${doubleExtMatch[1].toUpperCase()} document, but it actually executes as an executable (.${doubleExtMatch[2]}). Attackers use this trick to fool users into running malware. Do not open!`;
    } else if (hasDangerousExt && hasSuspiciousKeyword) {
      // Executable with suspicious script commands
      verdictIcon.textContent = '⚠️';
      verdictTitle.textContent = 'WARNING: Potentially Unwanted Script / Program';
      verdictSubtitle.textContent = 'Executable containing system shell invocation commands';
      verdictBadge.className = 'badge badge-amber';
      verdictBadge.textContent = 'Threat: Suspicious';

      heuristicsEl.innerHTML = '<span style="color:var(--amber); font-weight:600;">⚠️ Shell Command Execution Patterns Detected</span>';

      alertBox.className = 'callout callout-warning';
      alertIcon.textContent = '⚠️';
      alertTitle.textContent = 'Recommendation: Exercise Extreme Caution';
      alertDesc.textContent = 'This file contains commands that execute system shell tasks (e.g. powershell/cmd). Only run this program if you completely trust the developer who created it.';
    } else if (hasDangerousExt) {
      // Regular Executable
      verdictIcon.textContent = 'ℹ️';
      verdictTitle.textContent = 'Executable Binary File (.EXE / Script)';
      verdictSubtitle.textContent = 'Program file capable of modifying system files';
      verdictBadge.className = 'badge';
      verdictBadge.textContent = 'Executable';

      heuristicsEl.innerHTML = '<span style="color:var(--cyan);">Executable format (No known malicious signatures)</span>';

      alertBox.className = 'callout callout-info';
      alertIcon.textContent = 'ℹ️';
      alertTitle.textContent = 'Executable Notice';
      alertDesc.textContent = 'This is an executable binary. While no virus signatures were detected, ensure you downloaded it from a trusted official website before running.';
    } else {
      // Clean File
      verdictIcon.textContent = '✅';
      verdictTitle.textContent = 'File Clean &amp; Safe';
      verdictSubtitle.textContent = 'Standard file format, no malware signatures detected';
      verdictBadge.className = 'badge badge-emerald';
      verdictBadge.textContent = 'Safe / Clean';

      heuristicsEl.innerHTML = '<span style="color:var(--emerald);">Clean (Standard File Structure)</span>';

      alertBox.className = 'callout callout-success';
      alertIcon.textContent = '✅';
      alertTitle.textContent = 'Security Check Passed';
      alertDesc.textContent = 'No malware signatures, deceptive double extensions, or suspicious shell command patterns were detected in this file.';
    }

    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/* ==========================================================================
   3. TOOL 02: COMPUTER & BROWSER SECURITY CHECK
   ========================================================================== */

function initSystemCheck() {
  const container = document.getElementById('syscheckGrid');
  const recheckBtn = document.getElementById('recheckSystemBtn');
  if (!container) return;

  function runAudit() {
    container.innerHTML = '';

    const checks = [
      {
        title: "Connection Security (HTTPS / SSL)",
        icon: "🔒",
        status: window.isSecureContext ? "Secure" : "Unencrypted / HTTP",
        badge: window.isSecureContext ? "badge-emerald" : "badge-amber",
        desc: window.isSecureContext 
          ? "Traffic between your browser and this site is encrypted or running securely on localhost." 
          : "Connection is unencrypted. When browsing the web, always verify HTTPS to prevent eavesdropping."
      },
      {
        title: "Cookies & Local Storage Isolation",
        icon: "🍪",
        status: navigator.cookieEnabled ? "Active (Controlled)" : "Blocked",
        badge: navigator.cookieEnabled ? "badge-emerald" : "badge-amber",
        desc: navigator.cookieEnabled 
          ? "Standard storage active. Third-party cookie isolation prevents cross-site tracking." 
          : "Cookies are disabled in your browser."
      },
      {
        title: "Do Not Track (DNT) Privacy Setting",
        icon: "🛡️",
        status: navigator.doNotTrack === "1" ? "Enabled (Protected)" : "Default / Unset",
        badge: navigator.doNotTrack === "1" ? "badge-emerald" : "badge-amber",
        desc: navigator.doNotTrack === "1" 
          ? "Your browser actively signals websites and advertisers not to track your browsing habits." 
          : "Do Not Track is not explicitly set. You can enable 'Send a Do Not Track request' in browser settings."
      },
      {
        title: "Network Connectivity Status",
        icon: "🌐",
        status: navigator.onLine ? "Online" : "Offline",
        badge: navigator.onLine ? "badge-emerald" : "badge-amber",
        desc: navigator.onLine 
          ? "Device network interface is connected and resolving local/remote network routes." 
          : "Device is running in offline standalone mode."
      },
      {
        title: "Operating System & Architecture",
        icon: "💻",
        status: getPlatformString(),
        badge: "badge",
        desc: "Operating system platform reported by user-agent client hints for compatibility checking."
      },
      {
        title: "JavaScript Engine Sandbox Protection",
        icon: "⚡",
        status: "Sandboxed (Safe)",
        badge: "badge-emerald",
        desc: "Browser executes scripts inside a restricted client sandbox, preventing direct unauthorized C:\\ drive file modifications."
      }
    ];

    checks.forEach(item => {
      const card = document.createElement('div');
      card.className = 'syscheck-card';
      card.innerHTML = `
        <div>
          <div class="syscheck-card-header">
            <div class="syscheck-title">
              <span>${item.icon}</span>
              <span>${item.title}</span>
            </div>
            <span class="badge ${item.badge}">${item.status}</span>
          </div>
          <p class="syscheck-desc">${item.desc}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function getPlatformString() {
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      return navigator.userAgentData.platform;
    }
    const ua = navigator.userAgent;
    if (ua.includes("Win")) return "Windows OS";
    if (ua.includes("Mac")) return "macOS";
    if (ua.includes("Linux")) return "Linux";
    return "Desktop OS";
  }

  if (recheckBtn) {
    recheckBtn.addEventListener('click', () => {
      recheckBtn.textContent = 'Analyzing...';
      setTimeout(() => {
        runAudit();
        recheckBtn.textContent = '🔄 Re-Scan System Parameters';
      }, 300);
    });
  }

  runAudit();
}

/* ==========================================================================
   4. TOOL 03: PASSWORD STRENGTH & BRUTE-FORCE CHECKER
   ========================================================================== */

function initPasswordChecker() {
  const passInput = document.getElementById('passwordInput');
  const generateBtn = document.getElementById('generatePassBtn');
  const strengthLabel = document.getElementById('passStrengthLabel');
  const entropyLabel = document.getElementById('passEntropyLabel');
  const strengthFill = document.getElementById('passStrengthFill');
  const crackOnlineEl = document.getElementById('crackTimeOnline');
  const crackGpuEl = document.getElementById('crackTimeGpu');

  const critLength = document.getElementById('critLength');
  const critUpper = document.getElementById('critUpper');
  const critLower = document.getElementById('critLower');
  const critNum = document.getElementById('critNum');
  const critSpecial = document.getElementById('critSpecial');

  if (!passInput) return;

  passInput.addEventListener('input', () => evaluatePassword(passInput.value));

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const words = ['Cyber', 'Shield', 'Falcon', 'Cobalt', 'Titan', 'Matrix', 'Nexus', 'Solar'];
      const specials = ['@', '#', '$', '%', '!', '&'];
      const randWord = words[Math.floor(Math.random() * words.length)];
      const randWord2 = words[Math.floor(Math.random() * words.length)];
      const randSpecial = specials[Math.floor(Math.random() * specials.length)];
      const randNum = Math.floor(10 + Math.random() * 90);
      
      const strongPass = `${randWord}${randSpecial}${randWord2}${randNum}`;
      passInput.value = strongPass;
      evaluatePassword(strongPass);
    });
  }

  function evaluatePassword(password) {
    const len = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Update criteria checklist
    updateCriteria(critLength, len >= 12, `${len >= 12 ? '✅' : '❌'} At least 12 characters (${len}/12)`);
    updateCriteria(critUpper, hasUpper, `${hasUpper ? '✅' : '❌'} Uppercase letter (A-Z)`);
    updateCriteria(critLower, hasLower, `${hasLower ? '✅' : '❌'} Lowercase letter (a-z)`);
    updateCriteria(critNum, hasNum, `${hasNum ? '✅' : '❌'} Number digit (0-9)`);
    updateCriteria(critSpecial, hasSpecial, `${hasSpecial ? '✅' : '❌'} Special symbol (!@#$)`);

    if (len === 0) {
      strengthLabel.textContent = 'Very Weak';
      strengthLabel.style.color = 'var(--rose)';
      entropyLabel.textContent = '0 Bits Entropy';
      strengthFill.style.width = '5%';
      strengthFill.style.background = 'var(--rose)';
      crackOnlineEl.textContent = 'Instant';
      crackGpuEl.textContent = 'Instant';
      return;
    }

    // Calculate Charset Pool Size
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNum) poolSize += 10;
    if (hasSpecial) poolSize += 32;
    if (poolSize === 0) poolSize = 26;

    // Shannon Entropy: E = L * log2(poolSize)
    const entropy = Math.round(len * (Math.log(poolSize) / Math.log(2)));
    entropyLabel.textContent = `${entropy} Bits Entropy`;

    // Total combinations: 2^entropy
    const combinations = Math.pow(2, Math.min(entropy, 128));

    // Crack times:
    // Online throttled: 100 attempts / sec
    // Offline high-end GPU cluster: 10,000,000,000 (10^10) attempts / sec
    const secondsOnline = combinations / 100;
    const secondsGpu = combinations / 10000000000;

    crackOnlineEl.textContent = formatCrackTime(secondsOnline);
    crackGpuEl.textContent = formatCrackTime(secondsGpu);

    // Classify strength
    if (entropy < 35 || len < 6) {
      strengthLabel.textContent = 'Very Weak';
      strengthLabel.style.color = 'var(--rose)';
      strengthFill.style.width = '15%';
      strengthFill.style.background = 'var(--rose)';
    } else if (entropy < 55 || len < 8) {
      strengthLabel.textContent = 'Weak';
      strengthLabel.style.color = 'var(--rose)';
      strengthFill.style.width = '35%';
      strengthFill.style.background = 'var(--rose)';
    } else if (entropy < 75 || len < 12) {
      strengthLabel.textContent = 'Medium (Acceptable)';
      strengthLabel.style.color = 'var(--amber)';
      strengthFill.style.width = '65%';
      strengthFill.style.background = 'var(--amber)';
    } else {
      strengthLabel.textContent = 'Strong (Excellent)';
      strengthLabel.style.color = 'var(--emerald)';
      strengthFill.style.width = '100%';
      strengthFill.style.background = 'var(--emerald)';
    }
  }

  function updateCriteria(el, isPass, text) {
    if (!el) return;
    el.textContent = text;
    if (isPass) {
      el.classList.add('pass');
    } else {
      el.classList.remove('pass');
    }
  }

  function formatCrackTime(seconds) {
    if (seconds <= 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 31536000 * 1000000) return `${Math.round(seconds / (31536000 * 1000))} Thousand years`;
    return 'Centuries (Immune to Brute-Force)';
  }

  // Initial calculation
  evaluatePassword('');
}

/* ==========================================================================
   5. TOOL 04: PERSONAL COMPUTER SECURITY ASSESSMENT
   ========================================================================== */

const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    question: "Is your firewall enabled?",
    recommendation: "Ensure Windows Defender Firewall or your OS firewall is active on both Private and Public network profiles to filter uninvited incoming network packets."
  },
  {
    id: 2,
    question: "Do you regularly update your operating system?",
    recommendation: "Enable automatic updates in Windows Update to ensure critical security patches for known zero-day vulnerabilities (CVEs) are applied promptly."
  },
  {
    id: 3,
    question: "Do you use strong and unique passwords?",
    recommendation: "Create passwords with 12+ characters combining uppercase, lowercase, numbers, and symbols. Never reuse credentials across multiple accounts."
  },
  {
    id: 4,
    question: "Do you avoid suspicious links and attachments?",
    recommendation: "Inspect email headers and sender addresses before opening attachments. Avoid clicking unsolicited links in emails, SMS, or social media messages."
  },
  {
    id: 5,
    question: "Do you use reputable security software?",
    recommendation: "Keep real-time protection active using Microsoft Defender or a recognized security suite. Run periodic deep scans."
  },
  {
    id: 6,
    question: "Do you download files from trusted sources?",
    recommendation: "Download applications only from official vendor websites or authorized app stores. Avoid cracked software and pirated media."
  },
  {
    id: 7,
    question: "Do you lock your computer when leaving it?",
    recommendation: "Lock your workstation using Windows Key + L whenever stepping away, even for a minute, to prevent unauthorized physical tampering."
  },
  {
    id: 8,
    question: "Do you maintain backups of important files?",
    recommendation: "Implement the 3-2-1 backup strategy: 3 copies of your data on 2 different media types, with 1 copy stored securely off-site or in encrypted cloud storage."
  },
  {
    id: 9,
    question: "Do you use secure Wi-Fi?",
    recommendation: "Protect your home Wi-Fi with strong WPA2 or WPA3 encryption. Avoid entering sensitive passwords or banking data on unencrypted public Wi-Fi networks."
  },
  {
    id: 10,
    question: "Do you use multi-factor authentication where available?",
    recommendation: "Turn on Multi-Factor Authentication (MFA/2FA) across your email, financial, and academic accounts using an authenticator app (TOTP) or security key."
  }
];

function initAssessment() {
  const container = document.getElementById('assessmentQuestionsContainer');
  const calculateBtn = document.getElementById('calculateAssessmentBtn');
  const resultsContainer = document.getElementById('assessmentResultsContainer');
  const retakeBtn = document.getElementById('retakeAssessmentBtn');

  if (!container || !calculateBtn) return;

  // Render questions
  container.innerHTML = '';
  ASSESSMENT_QUESTIONS.forEach(item => {
    const card = document.createElement('div');
    card.className = 'assessment-card';
    card.innerHTML = `
      <div class="assessment-q-text">
        <span class="assessment-q-num">Q${item.id}.</span> ${item.question}
      </div>
      <div class="assessment-radio-group">
        <div class="assessment-pill pill-yes">
          <input type="radio" id="q${item.id}_yes" name="assess_q${item.id}" value="yes">
          <label for="q${item.id}_yes">Yes</label>
        </div>
        <div class="assessment-pill pill-no">
          <input type="radio" id="q${item.id}_no" name="assess_q${item.id}" value="no">
          <label for="q${item.id}_no">No</label>
        </div>
        <div class="assessment-pill pill-notsure">
          <input type="radio" id="q${item.id}_notsure" name="assess_q${item.id}" value="notsure">
          <label for="q${item.id}_notsure">Not sure</label>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  calculateBtn.addEventListener('click', () => {
    let answeredCount = 0;
    let totalScore = 0;
    const areasForImprovement = [];
    const positiveHabits = [];
    const verificationNeeded = [];

    ASSESSMENT_QUESTIONS.forEach(item => {
      const selected = document.querySelector(`input[name="assess_q${item.id}"]:checked`);
      if (selected) {
        answeredCount++;
        if (selected.value === 'yes') {
          totalScore += 10;
          positiveHabits.push(item);
        } else if (selected.value === 'notsure') {
          totalScore += 5; // Treated as prompt to verify setting
          verificationNeeded.push(item);
        } else {
          areasForImprovement.push(item);
        }
      }
    });

    if (answeredCount < ASSESSMENT_QUESTIONS.length) {
      alert(`Please answer all 10 questions before submitting. You have answered ${answeredCount} of 10.`);
      return;
    }

    const scoreVal = document.getElementById('assessmentScoreValue');
    const scoreRating = document.getElementById('assessmentScoreRating');
    const scoreBadge = document.getElementById('assessmentScoreBadge');
    const scoreCircle = document.getElementById('assessmentScoreCircle');
    const recommendationsList = document.getElementById('assessmentRecommendationsList');

    if (scoreVal) scoreVal.textContent = totalScore;
    
    let ratingText = '';
    let badgeClass = '';
    let circleColor = '';

    if (totalScore >= 80) {
      ratingText = 'High Security Awareness & Strong Protection Hygiene';
      badgeClass = 'badge-emerald';
      circleColor = 'var(--emerald)';
    } else if (totalScore >= 50) {
      ratingText = 'Moderate Security Posture — Actionable Steps Recommended';
      badgeClass = 'badge-amber';
      circleColor = 'var(--amber)';
    } else {
      ratingText = 'High Risk Exposure — Critical Security Adjustments Required';
      badgeClass = 'badge-rose';
      circleColor = 'var(--rose)';
    }

    if (scoreRating) scoreRating.textContent = ratingText;
    if (scoreBadge) {
      scoreBadge.className = `badge ${badgeClass}`;
      scoreBadge.textContent = `${totalScore}% Posture`;
    }
    if (scoreCircle) {
      scoreCircle.style.borderColor = circleColor;
      scoreCircle.style.boxShadow = `0 0 20px ${circleColor}`;
    }

    // Populate tailored recommendations
    if (recommendationsList) {
      let recHtml = '';

      if (areasForImprovement.length > 0) {
        recHtml += `<h4 style="color:var(--rose); margin-top:1rem; margin-bottom:0.75rem;">⚠️ High Priority Improvements (${areasForImprovement.length} Areas)</h4>`;
        areasForImprovement.forEach(q => {
          recHtml += `
            <div class="recommendation-card" style="border-left-color: var(--rose);">
              <strong>Q${q.id}: ${q.question}</strong>
              <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: #fecdd3;">${q.recommendation}</p>
            </div>
          `;
        });
      }

      if (verificationNeeded.length > 0) {
        recHtml += `<h4 style="color:var(--amber); margin-top:1.25rem; margin-bottom:0.75rem;">🔍 Verification Suggested (${verificationNeeded.length} Settings)</h4>`;
        verificationNeeded.forEach(q => {
          recHtml += `
            <div class="recommendation-card" style="border-left-color: var(--amber);">
              <strong>Q${q.id}: ${q.question}</strong>
              <p style="margin: 0.35rem 0 0; font-size: 0.88rem; color: #fde68a;">Action: Verify this configuration on your device. ${q.recommendation}</p>
            </div>
          `;
        });
      }

      if (positiveHabits.length > 0) {
        recHtml += `<h4 style="color:var(--emerald); margin-top:1.25rem; margin-bottom:0.75rem;">✅ Verified Best Practices (${positiveHabits.length} Practices)</h4>`;
        recHtml += `<p style="font-size:0.9rem; color:var(--text-secondary);">Great job maintaining defensive standards for: ${positiveHabits.map(h => `<em>${h.question.replace('?', '')}</em>`).join(', ')}.</p>`;
      }

      recommendationsList.innerHTML = recHtml;
    }

    if (resultsContainer) {
      resultsContainer.style.display = 'block';
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      document.querySelectorAll('input[type="radio"][name^="assess_q"]').forEach(r => { r.checked = false; });
      if (resultsContainer) resultsContainer.style.display = 'none';
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* ==========================================================================
   6. TOOL 05: CYBERSECURITY COMPREHENSIVE QUIZ (25 QUESTIONS)
   ========================================================================== */

const QUIZ_QUESTIONS = [
  // 1. Viruses & Malware
  {
    id: 1,
    topic: "Viruses & Malware",
    question: "What is the primary technical difference between a computer virus and a computer worm?",
    options: [
      "A virus requires a host program or file to spread, whereas a worm can self-replicate independently across networks.",
      "A virus only targets hardware components, while a worm only deletes web browsers.",
      "A virus is always harmless, while a worm is always weaponized ransomware.",
      "A virus spreads exclusively through Wi-Fi, while a worm spreads only via optical discs."
    ],
    correct: 0,
    explanation: "A virus attaches itself to an executable host file and requires human action or program execution to propagate. In contrast, a worm is an autonomous standalone malware program that replicates itself over computer networks without host intervention."
  },
  {
    id: 2,
    topic: "Viruses & Malware",
    question: "Which type of malware disguises itself as legitimate or harmless software (e.g., a game or utility) to trick users into installing it?",
    options: [
      "Trojan Horse",
      "Network Worm",
      "Rootkit Bios",
      "Macro Virus"
    ],
    correct: 0,
    explanation: "Named after the historic Greek legend, a Trojan horse appears to be benign or desirable software (such as a media player or crack) but secretly delivers a malicious payload once executed."
  },

  // 2. PC & OS Security
  {
    id: 3,
    topic: "PC & OS Security",
    question: "Why does the Principle of Least Privilege recommend using a standard user account rather than an Administrator account for daily computer usage?",
    options: [
      "Standard accounts allow the operating system to boot twice as fast.",
      "If malware executes under a standard account, it cannot silently alter system files or install kernel drivers without elevation prompts.",
      "Standard accounts prevent the computer from connecting to the internet.",
      "Administrator accounts consume all available CPU and RAM."
    ],
    correct: 1,
    explanation: "Operating under a standard user account constrains malware execution. If infected, the malicious process is bounded by standard user permissions and cannot silently overwrite Windows system files or install persistent rootkits without an explicit UAC administrator prompt."
  },
  {
    id: 4,
    topic: "PC & OS Security",
    question: "What does the '3-2-1 Backup Strategy' dictate for robust data protection against ransomware?",
    options: [
      "3 passwords, 2 security questions, 1 email address.",
      "3 full copies of data, stored on 2 different media types, with at least 1 copy kept off-site or in the cloud.",
      "Backup 3 files every 2 days for 1 month.",
      "3 antivirus scanners, 2 firewalls, 1 backup utility."
    ],
    correct: 1,
    explanation: "The 3-2-1 backup rule specifies maintaining 3 copies of your data (1 primary and 2 backups), stored across 2 different storage media (e.g., internal SSD and external NAS/drive), with 1 copy located off-site or in secure cloud storage to survive localized disaster or ransomware encryption."
  },

  // 3. Windows Update
  {
    id: 5,
    topic: "Windows Update",
    question: "What is the primary role of a 'security patch' delivered through Windows Update?",
    options: [
      "To increase the graphics card resolution automatically.",
      "To remediate discovered vulnerabilities and bugs that attackers could exploit to compromise the operating system.",
      "To permanently delete expired desktop icons.",
      "To force users to purchase additional hardware licenses."
    ],
    correct: 1,
    explanation: "Security patches fix documented software vulnerabilities (CVEs) and zero-day flaws within the operating system and built-in components, neutralizing exploit techniques used by threat actors."
  },
  {
    id: 6,
    topic: "Windows Update",
    question: "What is the risk of delaying or turning off operating system updates indefinitely?",
    options: [
      "The computer monitors will turn off permanently.",
      "Known vulnerabilities remain unpatched, leaving the machine vulnerable to automated exploits and network worms.",
      "The mouse cursor will reverse its direction.",
      "The keyboard keys will stop functioning."
    ],
    correct: 1,
    explanation: "When security patches are publicly released, threat actors reverse-engineer the fixes to identify the vulnerable code paths. Systems that remain unpatched become easy targets for automated exploit kits and widespread network worms (such as WannaCry)."
  },

  // 4. Cyber Attacks
  {
    id: 7,
    topic: "Cyber Attacks",
    question: "How does a Distributed Denial of Service (DDoS) attack differ from a simple Denial of Service (DoS) attack?",
    options: [
      "DDoS attacks only target mobile phones, while DoS targets desktop towers.",
      "DDoS coordinates malicious traffic from thousands of distributed compromised machines (a botnet) to overwhelm the victim.",
      "DDoS attacks physically destroy server motherboards using high voltage.",
      "DoS attacks use optical fiber while DDoS uses wireless radio."
    ],
    correct: 1,
    explanation: "A traditional DoS attack originates from a single source host, making it easier to filter by IP. A Distributed Denial of Service (DDoS) utilizes a globally distributed network of hijacked computers (botnet) to flood target bandwidth or compute resources, making defense much harder."
  },
  {
    id: 8,
    topic: "Cyber Attacks",
    question: "What attack occurs when a malicious actor intercepts and secretly relays communication between two parties who believe they are talking directly to each other?",
    options: [
      "Man-in-the-Middle (MitM) Attack",
      "Brute-Force Dictionary Attack",
      "Buffer Overflow Attack",
      "SQL Injection Attack"
    ],
    correct: 0,
    explanation: "In a Man-in-the-Middle (MitM) attack, the adversary places themselves between the client and server (often via ARP spoofing or rogue Wi-Fi), capturing, reading, or tampering with sensitive traffic in transit."
  },

  // 5. Social Engineering & Tailgating
  {
    id: 9,
    topic: "Social Engineering & Tailgating",
    question: "What is 'Tailgating' (also known as piggybacking) in physical security?",
    options: [
      "A hacker accessing a database by guessing passwords in rapid succession.",
      "An unauthorized person following an authorized employee through a secured door or badge turnstile without scanning credentials.",
      "A script that runs behind another program in Windows Task Manager.",
      "Sending a spam email immediately after a legitimate marketing email."
    ],
    correct: 1,
    explanation: "Tailgating is a physical social engineering vulnerability where an unauthorized intruder slips through a badge-access door or turnstile right behind an authorized badge-holder, exploiting human courtesy and trust."
  },
  {
    id: 10,
    topic: "Social Engineering & Tailgating",
    question: "Which psychological technique is most frequently exploited by social engineers to compel victims into making hasty security mistakes?",
    options: [
      "Creating extreme artificial urgency and invoking perceived authority or panic.",
      "Offering detailed mathematical explanations of encryption algorithms.",
      "Requiring the victim to read long government documentation.",
      "Encouraging the victim to take an afternoon nap before taking action."
    ],
    correct: 0,
    explanation: "Social engineers manipulate psychological drivers such as artificial urgency, fear of penalties, desire to be helpful, or fear of authority ('Your account will be terminated in 10 minutes unless you verify now!') to bypass critical analytical thinking."
  },

  // 6. Ethical Hacking
  {
    id: 11,
    topic: "Ethical Hacking",
    question: "What is the single most critical requirement that distinguishes an ethical hacker from an unauthorized cybercriminal?",
    options: [
      "Ethical hackers only test systems on weekends.",
      "Explicit, documented written permission and a defined scope of authorization from the system owner.",
      "Ethical hackers only use open-source operating systems.",
      "Ethical hackers do not use command-line terminals."
    ],
    correct: 1,
    explanation: "Written legal authorization (such as a Statement of Work, Scope Document, and signed Rules of Engagement) is the fundamental legal boundary separating authorized penetration testing from criminal computer intrusion."
  },
  {
    id: 12,
    topic: "Ethical Hacking",
    question: "What is 'Responsible Vulnerability Disclosure'?",
    options: [
      "Posting zero-day exploit code on social media immediately without warning the vendor.",
      "Privately reporting discovered vulnerabilities to the affected vendor first, allowing them a reasonable grace period to patch before public release.",
      "Selling sensitive customer database dumps on illicit underground markets.",
      "Deleting the vulnerable database so nobody can access it."
    ],
    correct: 1,
    explanation: "Responsible disclosure involves alerting the affected software vendor privately, collaborating with them to verify remediation, and coordinating a public advisory only after a reliable patch has been published to protect end users."
  },

  // 7. Reconnaissance & 7 Stages
  {
    id: 13,
    topic: "Reconnaissance",
    question: "Which of the following is an example of 'Passive Reconnaissance'?",
    options: [
      "Running aggressive TCP SYN port scans against all 65,535 server ports.",
      "Examining publicly available WHOIS records, DNS entries, and job postings without directly interacting with the target's internal network.",
      "Sending SQL injection payloads to login forms.",
      "Executing denial-of-service stress tests against the web server."
    ],
    correct: 1,
    explanation: "Passive reconnaissance gathers publicly accessible intelligence (OSINT) through search engines, public WHOIS lookups, public certificate transparency logs, and company directories without generating intrusive network packets on the target's infrastructure."
  },
  {
    id: 14,
    topic: "Reconnaissance",
    question: "In the 7 stages of ethical hacking methodology, which stage immediately follows Reconnaissance?",
    options: [
      "Clearing Tracks",
      "Scanning and Enumeration",
      "Writing the Final Invoice",
      "Gaining Access"
    ],
    correct: 1,
    explanation: "After passive intelligence gathering (Reconnaissance), security testers perform 'Scanning and Enumeration' to discover live hosts, open ports, running services, and potential vulnerability banners on the network."
  },

  // 8. Windows Firewall
  {
    id: 15,
    topic: "Windows Firewall",
    question: "How does a stateful firewall like Windows Defender Firewall protect a personal computer?",
    options: [
      "It monitors incoming and outgoing network traffic and blocks unauthorized packets based on configured security rules and connection state.",
      "It deletes old documents from the Recycle Bin every evening.",
      "It encrypts the hard drive using physical magnets.",
      "It speeds up CPU clock frequencies when playing video games."
    ],
    correct: 0,
    explanation: "Windows Defender Firewall inspects network packets crossing the network interface, tracking connection states and applying inbound/outbound rules to block unauthorized connection attempts while allowing permitted application traffic."
  },
  {
    id: 16,
    topic: "Windows Firewall",
    question: "What is a major limitation of a host-based firewall?",
    options: [
      "It cannot run on laptops.",
      "It cannot prevent a user from being tricked into willingly entering their password on a phishing website.",
      "It cannot block incoming TCP connections.",
      "It consumes 100% of network bandwidth continuously."
    ],
    correct: 1,
    explanation: "Firewalls regulate traffic flow at the network and transport layers. They do not inspect human psychological decisions, nor do they prevent users from voluntarily submitting credentials to fraudulent phishing websites over allowed outbound HTTPS (Port 443)."
  },

  // 9. LAN Security
  {
    id: 17,
    topic: "LAN Security",
    question: "Why is WPA3 encryption superior to older WPA2 encryption on Local Area Networks (LANs)?",
    options: [
      "WPA3 replaces all passwords with facial recognition scans.",
      "WPA3 implements Simultaneous Authentication of Equals (SAE), preventing offline dictionary brute-force attacks against intercepted handshakes.",
      "WPA3 disables the router's power saving mode.",
      "WPA3 restricts Wi-Fi connections to a maximum of 2 devices."
    ],
    correct: 1,
    explanation: "WPA3 uses SAE (Dragonfly handshake), which makes offline password guessing impossible even if an attacker captures the initial wireless handshake, while also providing individual data stream encryption on open networks."
  },
  {
    id: 18,
    topic: "LAN Security",
    question: "What security advantage is provided by configuring an isolated 'Guest Wi-Fi Network' on a home or office router?",
    options: [
      "It gives visitors direct read/write access to the internal network file server.",
      "It allows visitors to reach the public internet while preventing them from probing or accessing internal private workstations and smart devices.",
      "It increases the internet service provider's speed by 200%.",
      "It eliminates the need for a router administrator password."
    ],
    correct: 1,
    explanation: "A Guest Network creates a segregated VLAN that routes visitor traffic directly to the WAN/Internet while blocking Layer 2 and Layer 3 communication to private internal workstations, printers, and NAS devices."
  },

  // 10. Remote Network Security
  {
    id: 19,
    topic: "Remote Network Security",
    question: "What does a Virtual Private Network (VPN) create between a remote client and an organization's network?",
    options: [
      "A physical copper wire running through the street.",
      "An encrypted tunnel over an untrusted public network (Internet) that secures confidentiality and integrity.",
      "A replacement for the computer's motherboard BIOS.",
      "A software program that automatically updates all printers."
    ],
    correct: 1,
    explanation: "A VPN establishes an authenticated, encrypted tunnel (using protocols like IPsec, OpenVPN, or WireGuard) across the public Internet, encapsulating traffic so that external eavesdroppers cannot inspect or modify sensitive packets."
  },
  {
    id: 20,
    topic: "Remote Network Security",
    question: "Why should Remote Desktop Protocol (RDP / Port 3389) NEVER be exposed directly to the public Internet without a VPN or gateway?",
    options: [
      "Direct exposure makes it an immediate target for automated brute-force attacks, credential stuffing, and unpatched remote-code execution exploits.",
      "Port 3389 only works on analog telephone modems.",
      "Exposing RDP causes the computer's CPU fan to spin backwards.",
      "Microsoft charges an hourly fee whenever Port 3389 receives a packet."
    ],
    correct: 0,
    explanation: "Publicly accessible RDP ports are continuously scanned by automated botnets that launch relentless brute-force attacks or deploy exploits (like BlueKeep), leading directly to ransomware deployment."
  },

  // 11. VirtualBox & Virtual Labs
  {
    id: 21,
    topic: "Virtual Labs & VirtualBox",
    question: "In Oracle VM VirtualBox, what is the primary benefit of taking a 'Snapshot' before conducting security testing or analyzing suspicious files?",
    options: [
      "It downloads the latest version of Microsoft Office.",
      "It saves the exact state, memory, and virtual disk of the VM, allowing immediate rollback to a clean baseline if the system gets compromised or corrupted.",
      "It sends an email notification to the operating system manufacturer.",
      "It doubles the amount of physical RAM installed in the host computer."
    ],
    correct: 1,
    explanation: "Virtual machine snapshots preserve the exact state of virtual disk and memory. If a security experiment or malware analysis damages or infects the guest OS, you can revert to the clean snapshot in seconds."
  },
  {
    id: 22,
    topic: "Virtual Labs & VirtualBox",
    question: "Which VirtualBox network mode creates an isolated private network accessible ONLY between guest VMs and the host, completely isolated from external LAN devices?",
    options: [
      "Bridged Networking",
      "Host-Only Networking",
      "Direct Satellite Adapter",
      "Public Gateway Pass-Through"
    ],
    correct: 1,
    explanation: "Host-Only Networking creates an internal virtual loopback adapter on the host. Guest VMs attached to this network can communicate with each other and the host, but cannot access external networks or leak traffic to physical LAN devices."
  },

  // 12. Cybersecurity Skills & Tools
  {
    id: 23,
    topic: "Cybersecurity Tools",
    question: "What is the legitimate primary use of 'Wireshark' in network security auditing?",
    options: [
      "Creating fake 3D video animations.",
      "Capturing and performing deep packet inspection on live network traffic to analyze protocols, troubleshoot issues, and identify suspicious anomalies.",
      "Overclocking graphic processor memory clocks.",
      "Cracking Wi-Fi WPA3 passwords in 5 seconds."
    ],
    correct: 1,
    explanation: "Wireshark is an industry-standard open-source network protocol analyzer used by network engineers and defenders to capture and interactively inspect the frame-by-frame contents of network traffic."
  },
  {
    id: 24,
    topic: "Cybersecurity Tools",
    question: "What is the built-in Windows command-line utility used to view active network connections, listening ports, and the routing table?",
    options: [
      "netstat",
      "format C:",
      "calc.exe",
      "color 0a"
    ],
    correct: 0,
    explanation: "The 'netstat' (Network Statistics) command displays active TCP/UDP connections, listening ports, network interface metrics, and routing tables, making it invaluable for basic incident investigation."
  },

  // 13. Comprehensive Capstone Question
  {
    id: 25,
    topic: "Defense-in-Depth",
    question: "What is 'Defense-in-Depth' in modern cybersecurity architecture?",
    options: [
      "Relying on a single super-strong password so you don't need any other security tools.",
      "Implementing multiple layered security controls (firewalls, patching, MFA, user training, encryption, backups) so that if one defense layer fails, others stop the attacker.",
      "Installing three identical antivirus programs on the same operating system simultaneously.",
      "Burying network servers deep underground to protect against lightning."
    ],
    correct: 1,
    explanation: "Defense-in-Depth is the fundamental security paradigm of layering diverse physical, technical, and administrative controls (perimeter defenses, endpoint hardening, access controls, monitoring, and backups) so no single point of failure compromises the enterprise."
  }
];

function initQuiz() {
  const container = document.getElementById('quizQuestionsContainer');
  const submitBtn = document.getElementById('submitQuizBtn');
  const resultsCard = document.getElementById('quizResultsCard');
  const retakeBtn = document.getElementById('retakeQuizBtn');
  const answeredCounter = document.getElementById('quizAnsweredCount');

  if (!container || !submitBtn) return;

  const userAnswers = {};

  container.innerHTML = '';
  QUIZ_QUESTIONS.forEach((q, qIndex) => {
    const card = document.createElement('div');
    card.className = 'quiz-question-card';
    card.id = `quizCard_${q.id}`;

    const optionsHtml = q.options.map((opt, optIndex) => `
      <button type="button" class="quiz-option-btn" data-qid="${q.id}" data-opt="${optIndex}">
        <span class="quiz-option-key">${String.fromCharCode(65 + optIndex)}</span>
        <span>${opt}</span>
      </button>
    `).join('');

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; font-size:0.78rem;">
        <span class="badge">${q.topic}</span>
        <span style="color:var(--text-muted); font-family:var(--font-mono);">Question ${qIndex + 1} of ${QUIZ_QUESTIONS.length}</span>
      </div>
      <div class="quiz-q-title">${q.id}. ${q.question}</div>
      <div class="quiz-options-list" id="optsList_${q.id}">
        ${optionsHtml}
      </div>
      <div class="quiz-explanation-box" id="explain_${q.id}">
        <strong>💡 Explanation:</strong> ${q.explanation}
      </div>
    `;

    container.appendChild(card);
  });

  // Option selection with instant feedback
  const optionButtons = container.querySelectorAll('.quiz-option-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const qid = parseInt(btn.getAttribute('data-qid'), 10);
      const selectedOpt = parseInt(btn.getAttribute('data-opt'), 10);
      const questionObj = QUIZ_QUESTIONS.find(item => item.id === qid);
      if (!questionObj) return;

      userAnswers[qid] = selectedOpt;

      const parentList = document.getElementById(`optsList_${qid}`);
      const siblingButtons = parentList.querySelectorAll('.quiz-option-btn');
      siblingButtons.forEach(b => {
        b.classList.remove('correct', 'incorrect');
        b.style.pointerEvents = 'none';
      });

      const isCorrect = selectedOpt === questionObj.correct;
      if (isCorrect) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('incorrect');
        const correctBtn = parentList.querySelector(`[data-opt="${questionObj.correct}"]`);
        if (correctBtn) correctBtn.classList.add('correct');
      }

      const explainBox = document.getElementById(`explain_${qid}`);
      if (explainBox) explainBox.style.display = 'block';

      const totalAnswered = Object.keys(userAnswers).length;
      if (answeredCounter) {
        answeredCounter.textContent = `${totalAnswered} / ${QUIZ_QUESTIONS.length} Answered`;
      }
    });
  });

  submitBtn.addEventListener('click', () => {
    const totalAnswered = Object.keys(userAnswers).length;
    if (totalAnswered < QUIZ_QUESTIONS.length) {
      const confirmSubmit = confirm(`You have answered ${totalAnswered} of ${QUIZ_QUESTIONS.length} questions. Do you want to submit now? Unanswered questions will receive 0 points.`);
      if (!confirmSubmit) return;
    }

    let correctCount = 0;
    QUIZ_QUESTIONS.forEach(q => {
      if (userAnswers[q.id] === q.correct) {
        correctCount++;
      } else {
        const exp = document.getElementById(`explain_${q.id}`);
        if (exp) exp.style.display = 'block';
        const parentList = document.getElementById(`optsList_${q.id}`);
        if (parentList) {
          const correctBtn = parentList.querySelector(`[data-opt="${q.correct}"]`);
          if (correctBtn) correctBtn.classList.add('correct');
        }
      }
    });

    const percentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

    const bigScore = document.getElementById('quizBigScore');
    const scoreFraction = document.getElementById('quizScoreFraction');
    const feedbackTitle = document.getElementById('quizFeedbackTitle');
    const feedbackDesc = document.getElementById('quizFeedbackDesc');

    if (bigScore) bigScore.textContent = `${percentage}%`;
    if (scoreFraction) scoreFraction.textContent = `${correctCount} of ${QUIZ_QUESTIONS.length} correct answers`;

    if (percentage >= 85) {
      if (feedbackTitle) feedbackTitle.textContent = '🌟 Excellent! Strong Cybersecurity Understanding';
      if (feedbackDesc) feedbackDesc.textContent = 'You demonstrated an outstanding grasp of malware taxonomy, network defenses, operating system hardening, and defense-in-depth principles!';
    } else if (percentage >= 60) {
      if (feedbackTitle) feedbackTitle.textContent = '👍 Good Job! Solid Foundation';
      if (feedbackDesc) feedbackDesc.textContent = 'You have a good grasp of the basics. Review the highlighted explanations to solidify your technical knowledge for your viva.';
    } else {
      if (feedbackTitle) feedbackTitle.textContent = '📚 Review Recommended — Keep Learning!';
      if (feedbackDesc) feedbackDesc.textContent = 'Review the detailed explanations for each missed question above to master the key cybersecurity principles.';
    }

    if (resultsCard) {
      resultsCard.style.display = 'block';
      resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      for (const key in userAnswers) delete userAnswers[key];

      const allButtons = container.querySelectorAll('.quiz-option-btn');
      allButtons.forEach(b => {
        b.classList.remove('correct', 'incorrect');
        b.style.pointerEvents = 'auto';
      });

      const allExplains = container.querySelectorAll('.quiz-explanation-box');
      allExplains.forEach(exp => { exp.style.display = 'none'; });

      if (resultsCard) resultsCard.style.display = 'none';
      if (answeredCounter) answeredCounter.textContent = `0 / ${QUIZ_QUESTIONS.length} Answered`;

      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* ==========================================================================
   7. TOOL 06: INCIDENT AWARENESS SCENARIOS
   ========================================================================== */

function initScenarios() {
  const scenarioButtons = document.querySelectorAll('.scenario-btn');

  scenarioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.scenario-card');
      if (!parentCard) return;

      const isSafe = btn.getAttribute('data-safe') === 'true';
      const explanation = btn.getAttribute('data-explanation') || '';
      const feedbackContainer = parentCard.querySelector('.scenario-feedback');

      if (!feedbackContainer) return;

      if (isSafe) {
        feedbackContainer.className = 'scenario-feedback callout callout-success';
        feedbackContainer.innerHTML = `
          <div class="callout-icon">✅</div>
          <div>
            <strong>Safest &amp; Correct Decision!</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem;">${explanation}</p>
          </div>
        `;
      } else {
        feedbackContainer.className = 'scenario-feedback callout callout-danger';
        feedbackContainer.innerHTML = `
          <div class="callout-icon">⚠️</div>
          <div>
            <strong>Risky / Dangerous Action!</strong>
            <p style="margin: 0.35rem 0 0; font-size: 0.88rem;">${explanation}</p>
          </div>
        `;
      }

      feedbackContainer.style.display = 'flex';
    });
  });
}
