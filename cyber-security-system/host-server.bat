@echo off
title Cyber Security System - Local Web Server
cls
echo ================================================================
echo    Starting Local Web Server for Cyber Security Project...
echo ================================================================
echo.
echo Running on http://localhost:8000/
echo Press Ctrl+C to stop the server anytime.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0host-server.ps1" -Port 8000
pause
