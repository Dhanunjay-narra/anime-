@echo off
title Desktop Companion
cd /d "%~dp0"
echo Starting Desktop Companion Overlay...
start "" ".\node_modules\electron\dist\electron.exe" .
exit
