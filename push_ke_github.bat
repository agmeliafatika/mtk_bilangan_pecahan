@echo off
title Push ke GitHub - mtk_bilangan_pecahan
echo ========================================================
echo   SEDANG MENGUNGGAH (PUSH) FILE KE GITHUB...
echo   Repositori: https://github.com/agmeliafatika/mtk_bilangan_pecahan
echo ========================================================
echo.
cd /d "D:\antigravity"
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   [BERHASIL!] Seluruh file berhasil diunggah ke GitHub!
    echo   Silakan buka: https://github.com/agmeliafatika/mtk_bilangan_pecahan
    echo ========================================================
) else (
    echo ========================================================
    echo   Jika diminta login, silakan klik "Sign in with your browser"
    echo   atau masukkan Personal Access Token (PAT) GitHub Anda.
    echo ========================================================
)
echo.
pause
