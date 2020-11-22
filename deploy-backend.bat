@echo off
echo.
echo U L T I M A T E  G ^- I N D E X  B A C K E N D  D E P L O Y E R
echo.
echo by
echo.   ______               __  __
echo.  / __/ /  ___ ____    / /_/ /__
echo. _\ \/ _ \/ _ `/ _ \  / __/  '_/
echo. /___/_//_/\_,_/_//_/  \__/_/\_\
echo.
echo.
echo Deploying the Backend Now.
echo.
echo Make Sure You have Nodejs, Git Installed and You are in the Root of the Directory and not any Subfolders
echo.
echo Make Sure You have Every Environment Variables in Hand for Faster Deployment
echo.
echo Starting the Script Now
echo.
CALL npm i ^-g heroku
echo Login in to Your Heroku Account
CALL heroku login
echo.
CALL git clone --quiet --single-branch --branch master https://github.com/tks18/gindex-backend.git __temp__
echo.
echo Starting Deployment Process
echo.
set /p appname=Enter Unique Backend App Name in Heroku:
CALL heroku create %appname%
echo.
CALL heroku git:remote ^-a %appname%
echo.
echo Pushing G Index Backend to Heroku
CALL git subtree push ^-^-prefix __temp__ heroku master
echo.
echo Now Have Your Environment Variables ready !!
echo.
set /p dburl=Enter the MongoDB url that You Copied from their Website:
set /p site=Enter the Heroku App Website to which it is Deployed:
set /p emailid=Enter the Email ID from which User Messages will be Sent:
set /p emailpass=Enter the Email Password for the Above:
set /p emailport=Enter the Email Port for the Above:
set /p emailservice=Enter the Email Provider Name(Eg: Gmail, Yahoo, etc.):
set /p emailsmtp=Enter the SMTP Address for the Email Provider:
set /p adminemail=Enter the Admin Email ID(Can be Anything or can be Same as the Above Email ID):
set /p replyemail=Confirm the Before Email Again:
set /p maxsessions=Enter the Number of Maximum Active Sessions that Users can Login Simultaneously(Eg: 1, 2, 5, etc.):
set /p emailgif=Enter the Image Link for Displaying in Emails:
set /p sitesec=Enter a Secret Key that you will Remember (Should be Used while Creating a Superadmin Account after this Setup):
set /p tmdbapi=Enter the TMDB API Key for Metadata Info of Media in the Index (If You Don't Need, put NaN):
set /p fronturls=Enter the Frontend Url/Urls (Don't Put trailing / at the end) (Multiple Frontends can be Put Here by putting a ,):
set /p frontname=Enter the Frontend's Website Name (Can be Anything):
set /p tokensec=Enter a Super Long Token Secret that will be Used to Secure the JWT Tokens.(These are Never Required to be Remebered):
echo.
echo Pushing Config Keys to Heroku App.
echo.
CALL heroku config:set ^-a %appname% DBURL=%dburl% SITE=%site% EMAILID=%emailid% EMAILPASS=%emailpass% EMAILPORT=%emailport% EMAILSERVICE=%emailservice% EMAILSMTP=%emailsmtp% ADMINEMAIL=%adminemail% REPLYTOMAIL=%replyemail% MAXSESSIONS=%maxsessions% EMAILGIF=%emailgif% SITESECRET=%sitesec% TMDBAPI=%tmdbapi% FRONTENDURL=%fronturls% FRONTENDSITENAME=%frontname% TOKENSECRET=%tokensec%
pause
exit
