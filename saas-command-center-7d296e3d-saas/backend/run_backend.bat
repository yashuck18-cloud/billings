@echo off
echo Preparing Backend and Database Migration...
py migrate_and_setup.py
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Starting Flask Backend Server on http://localhost:5000 ...
    py wsgi.py
) else (
    echo.
    echo [ERROR] Database setup/migration encountered an issue.
    pause
)
