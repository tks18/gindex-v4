@echo off
echo.
echo U L T I M A T E  G ^- I N D E X  T H E M E  G E N E R A T O R
echo.
echo by
echo.   ______               __  __
echo.  / __/ /  ___ ____    / /_/ /__
echo. _\ \/ _ \/ _ `/ _ \  / __/  '_/
echo. /___/_//_/\_,_/_//_/  \__/_/\_\
echo.
echo.
echo Building all theme Assets.
echo.
echo Please Ensure Correct CDN in the .env.
echo.
echo Starting the Script Now.
echo.
echo Currently Building for Following Themes:
set themes=red blue orange green yellow netflix^-red deep-orange indigo lime pink purple red teal
for %%b in (%themes%) do (
  echo %%b
)
for %%a in (%themes%) do (
  @echo off
  echo.
  rmdir outputs\%%a /s /Q
  set VUE_APP_THEME=%%a
  echo Currently Building for %%a
  echo.
  yarn build
  robocopy "dist" "outputs/%%a" /move /E
)
echo.
echo Built Assets for Every Theme. Please find the Themes in Outputs Folder.
PAUSE
