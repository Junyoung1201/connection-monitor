@echo off
setlocal enabledelayedexpansion

if not exist "assets" (
    mkdir "assets"
)

xcopy "public\*" "assets\" /E /I /Y

pushd "../renderer"
npm run build
popd

xcopy "../renderer/build\*" "assets\" /E /I /Y

npm run build

echo Build process completed.