# Launcher Script for FinePrint Consumer Rights MCP Agent
# Launches FastAPI Backend on http://localhost:8000 and Next.js Frontend on http://localhost:3000

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   FinePrint — Consumer Rights MCP Agent (Track 1)       " -ForegroundColor Yellow
Write-Host "   wHACKiest 2026 | Team Onyx | BMSIT                     " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ROOT_DIR = $PSScriptRoot
$VENV_PYTHON = Join-Path $ROOT_DIR ".venv\Scripts\python.exe"
$FRONTEND_DIR = Join-Path $ROOT_DIR "frontend"

Write-Host "`n[1/3] Checking Environment..." -ForegroundColor Green
if (-Not (Test-Path $VENV_PYTHON)) {
    Write-Error "Virtual environment not found at $VENV_PYTHON. Run 'uv venv' or setup python venv."
}

Write-Host "[2/3] Launching FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
$backendJob = Start-Process -FilePath $VENV_PYTHON -ArgumentList "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload" -WorkingDirectory $ROOT_DIR -PassThru

Write-Host "[3/3] Launching Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Set-Location $FRONTEND_DIR
$frontendJob = Start-Process -FilePath "npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory $FRONTEND_DIR -PassThru

Write-Host "`n>>> FinePrint is live!" -ForegroundColor Yellow
Write-Host "• Frontend Cockpit : http://localhost:3000" -ForegroundColor White
Write-Host "• Backend API Docs : http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "• Benchmark Suite  : pytest tests/test_30_case_benchmark.py" -ForegroundColor White
Write-Host "`nPress Ctrl+C or close this terminal to stop both servers." -ForegroundColor Gray

# Wait for processes
try {
    Wait-Process -Id $backendJob.Id, $frontendJob.Id
} finally {
    Stop-Process -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendJob.Id -ErrorAction SilentlyContinue
}
