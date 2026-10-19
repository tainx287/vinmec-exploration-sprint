@echo off
title MyVinmec Plain-Language Care Navigator - Khởi Chạy Prototype
color 0A
echo =========================================================================
echo    MYVINMEC CARE NAVIGATOR - INTERACTIVE AI PROTOTYPE
echo    Du An: Vinmec x VRIC Exploration Sprint 6 Tuan (K1-K3)
echo    Ung Vien: Nguyen Xuan Tai (K2) - Technical Lead / Forward Deployed Engineer
echo =========================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [1/2] Phat hien Python tren he thong. Dang khoi dong Local Server...
    start /B python server.py >nul 2>nul
    timeout /t 1 >nul
    echo [2/2] Dang mo giao dien MyVinmec tren trinh duyet (http://localhost:8000)...
    start "" "http://localhost:8000"
) else (
    echo [1/1] Khong tim thay Python. Dang mo truc tiep index.html tren trinh duyet...
    start "" "index.html"
)

echo.
echo =========================================================================
echo  KHOI CHAY THANH CONG! Ban co the trai nghiem truc tiep tren trinh duyet.
echo  Cua so nay se tu dong dong sau 3 giay...
echo =========================================================================
timeout /t 3 >nul
exit
