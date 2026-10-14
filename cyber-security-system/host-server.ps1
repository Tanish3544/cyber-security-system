<#
.SYNOPSIS
    Lightweight, Zero-Dependency Local Web Server for Windows
    Project: Cyber Security Assessment and Protection System
    Requires NO Python, NO Node.js, and NO external installations.
#>

param(
    [int]$Port = 8000
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".md"   = "text/plain; charset=utf-8"
    ".txt"  = "text/plain; charset=utf-8"
}

$url = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
} catch {
    Write-Host "[ERROR] Could not start server on port $Port." -ForegroundColor Red
    Write-Host "Try running with another port, e.g.: .\host-server.ps1 -Port 8080" -ForegroundColor Yellow
    exit 1
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   CYBER SECURITY ASSESSMENT AND PROTECTION SYSTEM - LOCAL HOST" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Server running at: $url" -ForegroundColor Yellow
Write-Host "Serving files from: $scriptDir" -ForegroundColor Gray
Write-Host "Press Ctrl + C in this terminal to stop the server." -ForegroundColor Gray
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host ""

# Automatically launch browser
Start-Process $url

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $path = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($path) -or $path -eq "/") {
            $path = "index.html"
        }

        # URL decode path
        $path = [System.Uri]::UnescapeDataString($path)
        $fullPath = Join-Path $scriptDir $path

        # Security check: prevent directory traversal
        $resolvedPath = [System.IO.Path]::GetFullPath($fullPath)
        if (-not $resolvedPath.StartsWith($scriptDir)) {
            $response.StatusCode = 403
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.Close()
            continue
        }

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $contentType = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 200 OK: $path ($contentType)" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "[$([DateTime]::Now.ToString('HH:mm:ss'))] 404 Not Found: $path" -ForegroundColor Red
        }

        $response.Close()
    } catch {
        if (-not $listener.IsListening) { break }
    }
}

$listener.Stop()
Write-Host "`nServer stopped." -ForegroundColor Yellow
