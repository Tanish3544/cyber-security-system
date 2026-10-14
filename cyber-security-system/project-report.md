# COLLEGE PROJECT REPORT

## 1. Title of Project
**Cyber Security Assessment and Protection System**  
*Subtitle: "Learn Cybersecurity. Understand Threats. Improve Protection."*

---

## 2. Duration
**Academic Semester Project**  
*Term: Final Course Submission*

---

## 3. Title of Course
**Cyber Security (Computer Engineering)**

---

## 4. Abstract
The **Cyber Security Assessment and Protection System** is an interactive, browser-based cybersecurity application developed as a practical final project for an undergraduate Computer Engineering course. To ensure the project delivers hands-on practical utility rather than merely presenting static reading material, the application integrates five functional cybersecurity tools:

1. A **Basic File & Malware Scanner** that allows users to upload local files, computes their real cryptographic SHA-256 hash using the Web Crypto API, inspects file extensions for deceptive masquerading patterns (e.g. double extensions like `file.pdf.exe`), and checks for standard antivirus test signatures (such as the international EICAR test string).
2. A **Computer & Browser Security Check** that audits the client environment for HTTPS encryption, cookie protection, Do Not Track privacy signals, and platform properties.
3. A **Password Strength & Brute-Force Checker** that calculates mathematical information entropy (bits) and estimates crack times across online and offline attack scenarios.
4. An interactive **Personal Computer Security Assessment** evaluating endpoint hygiene across 10 structured checks, calculating a transparent score out of 100 with personalized remediation guidance.
5. An academic **25-Question Cybersecurity Quiz** featuring instant correct/incorrect answer verification and comprehensive explanations, alongside **5 Incident Awareness Scenarios**.

The system is built entirely using standard HTML5, CSS3, and modern Vanilla JavaScript (ES6+). It requires zero external dependencies, runs locally in any web browser, and provides a clear, practical demonstration of core cybersecurity principles suitable for an engineering student viva.

---

## 5. Introduction
Cybersecurity is one of the most critical fields in modern Computer Engineering. From protecting personal computers against malware infections to safeguarding enterprise networks against sophisticated cyber attacks, understanding how security mechanisms work in practice is essential for engineering students.

Traditional student assignments often focus either on abstract theoretical papers or on complex third-party tools whose inner workings remain hidden. This project addresses that challenge by building an accessible, transparent, and functional security tool from the ground up.

By implementing fundamental security tasks—such as computing cryptographic hashes, identifying malicious file naming patterns, auditing client browser configurations, testing password resilience, and assessing overall security awareness—the **Cyber Security Assessment and Protection System** provides a concrete, easy-to-understand educational platform.

---

## 6. Problem Statement
Many computer engineering students and everyday computer users encounter the following challenges:

1. **Lack of Practical Understanding of Antivirus Basics:** Students learn about file hashes and signatures in lectures, but rarely see how a scanner actually reads file bytes, generates a cryptographic hash, or identifies an EICAR test signature in a simple program.
2. **Abstract Password Security:** Users are told to create "strong passwords," but lack intuitive visual tools that demonstrate the mathematical difference between a 7-character password and a 12-character passphrase against GPU-accelerated brute-force attacks.
3. **No Simple Endpoint Self-Assessment:** Standard security auditing tools are complex commercial products. Beginners need a clear, non-destructive self-audit tool that checks their security habits and explains what steps to take.
4. **Complexity of Setup:** Many educational security labs require virtual machine installations, Linux servers, or Python environments, which can be difficult to run during brief classroom presentations and oral viva evaluations.

---

## 7. Objectives
The core objectives of this project are:

1. **Implement a Client-Side File Scanner:** Allow users to upload or drag-and-drop any file to compute its real SHA-256 hash in browser memory and detect known threat patterns (EICAR test string, double extensions, suspicious script keywords).
2. **Build a System & Browser Security Check:** Automatically inspect the user's connection context (HTTPS), cookie isolation, and privacy headers to display a clear security status report.
3. **Create a Password Strength Auditor:** Calculate password entropy (bits) in real time and estimate the time required for an attacker to crack it using online vs. high-speed offline dictionary attacks.
4. **Develop a 10-Question Posture Assessment:** Provide a transparent 100-point self-assessment tool that categorizes findings into immediate improvements, verification suggestions, and positive habits.
5. **Author a 25-Question Knowledge Quiz:** Test student comprehension across viruses, network security, firewalls, and defenses, with instant feedback and explanations for viva preparation.
6. **Ensure Beginner-Friendly Architecture:** Use pure HTML5, CSS3, and Vanilla JavaScript with no frameworks or database requirements, making the project simple to explain and run anywhere.

---

## 8. Theory

### 8.1 Cryptographic Hashing (SHA-256)
A cryptographic hash function converts arbitrary data into a fixed-size string of characters. A secure hash is deterministic, quick to compute, irreversible (one-way), and exhibits an avalanche effect (a tiny change in input completely changes the hash). In cybersecurity, hashes are used to verify file integrity and identify malware: if a downloaded file's SHA-256 hash matches a known malicious hash in an antivirus database, the file is identified without needing to execute it.

### 8.2 Antivirus Signatures and the EICAR Standard
Antivirus software scans files for known signatures—specific byte sequences or text strings characteristic of malware. To allow developers, researchers, and students to safely test antivirus scanners without handling real malware, the European Institute for Computer Antivirus Research created the **EICAR Standard Anti-Virus Test File**. It is a safe 68-character text string that standard security scanners identify as a test threat.

### 8.3 Deceptive Double Extensions
Attackers often disguise executable malware using social engineering tricks like double extensions (e.g. `salary_slip.pdf.exe`). Because Windows hides known file extensions by default on fresh installations, an unsuspecting user only sees `salary_slip.pdf` and clicks it, accidentally launching an executable binary instead of a document.

### 8.4 Password Entropy & Brute-Force Math
Password entropy measures the unpredictable randomness of a password in bits:
$$E = L \times \log_2(R)$$
where $L$ is password length and $R$ is the size of the character pool (lowercase = 26, mixed alphanumeric = 62, full symbols = 94). A password with 35 bits of entropy can be cracked by an offline GPU cluster in seconds, whereas a passphrase with 75+ bits requires centuries of computation.

---

## 9. System Design & Architecture

```
+------------------------------------------------------------------------+
|               USER INTERFACE LAYER (HTML5 & CSS3)                      |
|  - High-Tech Dark Cyber Console (#070d18, #0f172a, #131d35)           |
|  - Responsive Top Navigation with Mobile Drawer                       |
|  - Interactive Drag & Drop File Upload Zone                           |
|  - System Audit Cards & Password Evaluation Bars                      |
+------------------------------------------------------------------------+
                                   |
                                   v
+------------------------------------------------------------------------+
|               CLIENT-SIDE LOGIC ENGINE (JavaScript ES6+)              |
|                                                                        |
|  [File & Malware Scanner]     [System Security Check]                  |
|  - FileReader (ArrayBuffer)   - window.isSecureContext (HTTPS)         |
|  - crypto.subtle (SHA-256)    - navigator.cookieEnabled                |
|  - EICAR Signature Check      - navigator.doNotTrack                   |
|  - Double Extension Regex     - Client Platform Audit                  |
|                                                                        |
|  [Password Auditor]           [10-Question Assessment]                 |
|  - Shannon Entropy Math       - 100-Point Transparent Score            |
|  - Combinations & Crack Time  - Dynamic Recommendations List           |
|                                                                        |
|  [25-Question Quiz]           [Incident Scenarios]                     |
|  - Instant Feedback & Reason  - Real-World Decision Simulation         |
+------------------------------------------------------------------------+
```

---

## 10. Implementation Details

### 10.1 File Scanner Implementation
The file scanner uses the browser's native `FileReader` API:
1. When a user drops or chooses a file, `file.arrayBuffer()` loads the binary contents.
2. `crypto.subtle.digest('SHA-256', arrayBuffer)` calculates the cryptographic hash asynchronously.
3. A text slice of the first 64 KB is checked for signature strings:
   - `textSlice.includes('EICAR-STANDARD-ANTIVIRUS-TEST-FILE')`
   - Regex testing for double extensions: `/\.(pdf|docx|jpg|txt)\.(exe|bat|vbs|cmd|ps1)$/i`
4. The user interface updates dynamically, displaying the file name, formatted size, SHA-256 hex string, and a color-coded threat alert (Clean, Suspicious, or Malicious).

### 10.2 System Check Implementation
The system check uses native browser APIs (`navigator` and `window` objects) to audit real client properties:
- `window.isSecureContext`: verifies encrypted connection status.
- `navigator.cookieEnabled`: verifies standard cookie/storage availability.
- `navigator.doNotTrack`: checks privacy tracking preference.
- `navigator.onLine`: verifies network connectivity.

### 10.3 Password Auditor Implementation
The password auditor computes charset pool size based on character variety (uppercase, lowercase, numbers, symbols) and calculates Shannon entropy. It then calculates the total search space ($2^E$) and divides by standard attack speeds (100 guesses/sec for web rate-limited attacks, $10^{10}$ guesses/sec for an offline GPU cluster) to display understandable crack times.

---

## 11. Key Features

1. **Local File & Malware Scanner:** Calculates SHA-256 hashes, detects EICAR signatures, and warns about double extension tricks.
2. **One-Click EICAR Test Button:** Allows the student to instantly demonstrate virus detection to an examiner without needing to download external files.
3. **Automated System Security Audit:** Real-time inspection of browser security and privacy settings.
4. **Password Strength & Entropy Meter:** Real-time calculation of entropy and crack-time estimates with 5 visual criteria checklist pills.
5. **10-Question Endpoint Posture Assessment:** Calculates a clear score out of 100 with categorized recommendations.
6. **25-Question Knowledge Quiz:** Covers fundamental cybersecurity topics with instant feedback and pedagogical explanations.
7. **5 Incident Awareness Scenarios:** Realistic workplace and student attack simulations with safe protocol explanations.
8. **100% Client-Side & Zero Setup:** Operates offline in any browser with no server or installation dependencies.

---

## 12. Testing and Validation

| Test Case | Description | Expected Outcome | Actual Result | Status |
|---|---|---|---|---|
| **TC-01** | Upload clean `.txt` or `.png` file | Scanner calculates SHA-256 hash and marks file as Clean | Hash displayed correctly; marked Safe/Clean | **PASS** |
| **TC-02** | Test EICAR virus string button | Scanner identifies EICAR signature and triggers high-priority threat alert | Red alert badge and EICAR signature warning displayed | **PASS** |
| **TC-03** | Test double extension file (`invoice.pdf.exe`) | Scanner detects masquerading extension and warns user | Yellow alert badge and double extension warning displayed | **PASS** |
| **TC-04** | System Security Audit execution | Displays real status for HTTPS, cookies, DNT, and platform | All 6 parameter cards displayed accurate data | **PASS** |
| **TC-05** | Weak password entry ("abc123") | Flags as Very Weak with low entropy and instant crack time | Red strength bar, 18 bits entropy, instant crack time | **PASS** |
| **TC-06** | Strong passphrase entry ("Falcon#Matrix92!") | Flags as Strong with high entropy and multi-year crack time | Green strength bar, 85+ bits entropy, centuries crack time | **PASS** |
| **TC-07** | Random Strong password generator | Generates a 14+ character passphrase meeting all criteria | Generated passphrase, all 5 checklist pills passed | **PASS** |
| **TC-08** | Complete 10-question assessment | Computes accurate score out of 100 with tailored advice | Score calculated correctly; recommendations displayed | **PASS** |
| **TC-09** | Answer quiz questions | Instant green/red feedback with detailed explanation box | Correct answer highlighted in green; explanation shown | **PASS** |
| **TC-10** | Awareness scenario options | Instant feedback explaining safest response | Colored alert box with security reasoning displayed | **PASS** |

---

## 13. Limitations
1. **Browser Sandbox Environment:** Because the scanner runs inside a standard web browser, it cannot access the Windows kernel or scan the entire `C:\` drive automatically without the user selecting a file.
2. **Signature Database Scope:** The file scanner uses heuristic pattern analysis and standard test signatures (EICAR) rather than a commercial multi-gigabyte signature database.

---

## 14. Future Scope
1. **VirusTotal API Integration:** Connecting the file scanner to the public VirusTotal API to query SHA-256 hashes against 70+ commercial antivirus engines in real time.
2. **Desktop Application Version:** Packaging the project with Python/Electron to allow automated directory-level scanning of local folders.
3. **Pwned Password Lookup:** Integrating the HaveIBeenPwned k-Anonymity API to check whether a password has appeared in previous data breaches.

---

## 15. Conclusion
The **Cyber Security Assessment and Protection System** successfully provides a functional, beginner-friendly cybersecurity project designed specifically for Computer Engineering students. By replacing passive textbook reading with interactive, hands-on tools—including a real SHA-256 file scanner, an automated system audit, a password entropy calculator, a 100-point security assessment, and an academic quiz—the project demonstrates core cybersecurity concepts in an engaging and accessible format.

The project is built entirely on standard HTML5, CSS3, and modern JavaScript, ensuring it runs reliably on any computer and is simple to explain during academic viva evaluations.
