@echo off
title MyVinmec Plain-Language Care Navigator - Khoi Chay Prototype
color 0A
echo =========================================================================
echo    MYVINMEC CARE NAVIGATOR - INTERACTIVE AI PROTOTYPE
echo    Du An: Vinmec x VRIC Exploration Sprint 6 Tuan (K1-K3)
echo    Ung Vien: Nguyen Xuan Tai (K2) - Technical Lead / Forward Deployed Engineer
echo =========================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [1/2] Khoi dong Local Backend Server tai cong 8000...
    start "MyVinmec AI Server (Port 8000)" python server.py
    timeout /t 2 >nul
    echo [2/2] Dang mo giao dien MyVinmec tren trinh duyet (http://localhost:8000)...
    start "" "http://localhost:8000"
) else (
    echo [CANH BAO] Khong tim thay Python tren he thong PATH.
    echo Dang mo truc tiep index.html tren trinh duyet...
    start "" "index.html"
)

echo.
echo =========================================================================
echo  KHOI CHAY THANH CONG! May chu backend dang hoat dong tai http://localhost:8000
echo  (Vui long khong tat cua so MyVinmec AI Server trong qua trinh test)
echo =========================================================================
timeout /t 3 >nul
exit
