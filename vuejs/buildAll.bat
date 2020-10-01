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
echo Building all theme Assets.
echo.
echo Please Ensure Correct CDN in the .env.
echo.
echo Starting the Script Now.
echo.
echo Currently Building for Following Themes:
set themes=gradient^-carnation gradient^-curious^-blue gradient^-emerald gradient^-ice^-cold gradient^-konifer gradient^-netflix^-red gradient^-kournikova gradient^-mona^-lisa gradient^-persian^-rose gradient^-purple^-heart gradient^-purple^-mountains^-majesty gradient^-salmon gradient^-selective^-yellow gradient^-shamrock gradient^-witch^-haze black^-carnation black^-curious^-blue black^-emerald black^-ice^-cold black^-konifer black^-netflix^-red black^-kournikova black^-mona^-lisa black^-persian^-rose black^-purple^-heart black^-purple^-mountains^-majesty black^-salmon black^-selective^-yellow black^-shamrock black^-witch^-haze
for %%b in (%themes%) do (
  set /A i+=1
  echo %i%. %%b
)
for %%a in (%themes%) do (
  @echo off
  echo.
  rmdir outputs\%%a /s /Q
  set VUE_APP_THEME=%%a
  echo Currently Building for %%a
  echo.
  yarn build
  robocopy "dist" "outputs/%%a" /E
)
echo.
echo Built Assets for Every Theme. Please find the Themes in Outputs Folder.
exit
