@echo off
echo.
echo U L T I M A T E  G ^- I N D E X  T H E M E  B U I L D E R
echo.
echo by
echo.   ______               __  __
echo.  / __/ /  ___ ____    / /_/ /__
echo. _\ \/ _ \/ _ `/ _ \  / __/  '_/
echo. /___/_//_/\_,_/_//_/  \__/_/\_\
echo.
echo.
echo Please Ensure Correct CDN in the .env.
echo.
echo Starting the Script Now.
echo.
echo Currently Following Themes are Available:
set themes=carnation curious^-blue emerald ice^-cold konifer netflix^-red konifer kournikova mona^-lisa persian^-rose purple^-heart purple^-mountains^-majesty salmon selective^-yellow shamrock witch^-haze
for %%b in (%themes%) do (
  set /A i+=1
  echo %i%. %%b
)
set /p theme=Enter theme name as Above(Case Sensitive):
echo.
rmdir outputs\%theme% /s /Q
set VUE_APP_THEME=%theme%
echo Currently Building for %theme%
echo.
yarn build
robocopy "dist" "outputs/%theme%" /E
