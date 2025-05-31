@echo off
setlocal enabledelayedexpansion

if exist "assets" (
    for /d %%D in ("assets\*") do rd /s /q "%%D"
    for %%F in ("assets\*") do del /q "%%F"
) else (
    mkdir "assets"
)

xcopy "public\*" "assets\" /E /I /Y

pushd "../renderer"
call npm run build
popd

xcopy "../renderer/build\*" "assets\" /E /I /Y

npm run build