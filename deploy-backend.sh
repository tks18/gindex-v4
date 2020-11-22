#!/bin/bash
echo -e "\n"
echo 'U L T I M A T E  G ^- I N D E X  B A C K E N D  D E P L O Y E R'
echo -e "\n"
echo 'by'
echo   '______               __  __'
echo  '/ __/ /  ___ ____    / /_/ /__'
echo '_\ \/ _ \/ _ / _ \  / __/  _/'
echo '/___/_//_/\_,_/_//_/  \__/_/\_\'
echo -e "\n"
echo -e "\n"
echo 'Deploying the Backend Now'
echo -e "\n"
echo 'Make Sure You have Nodejs, Git Installed and You are in the Root of the Directory and not any Subfolders'
echo -e "\n"
echo 'Make Sure You have Every Environment Variables in Hand for Faster Deployment'
echo -e "\n"
echo 'Starting the Script Now'
echo -e "\n"
npm i -g heroku
echo 'Login in to Your Heroku Account'
heroku login
echo -e "\n"
CALL git clone --quiet --single-branch --branch master https://github.com/tks18/gindex-backend.git __temp__
echo -e "\n"
echo 'Starting Deployment Process'
echo -e "\n"
read -p 'Enter Unique Backend App Name in Heroku: ' appname
heroku create $appname
echo -e "\n"
heroku git:remote -a $appname
echo -e "\n"
echo 'Pushing G Index Backend to Heroku'
git subtree push --prefix __temp__ heroku master
echo -e "\n"
echo 'Now Have Your Environment Variables ready !!'
echo -e "\n"
read -p 'Enter the MongoDB url that You Copied from their Website: ' dburl
read -p 'Enter the Heroku App Website to which it is Deployed: ' site
read -p 'Enter the Email ID from which User Messages will be Sent: ' emailid
read -p 'Enter the Email Password for the Above: ' emailpass
read -p 'Enter the Email Port for the Above: ' emailport
read -p 'Enter the Email Provider Name(Eg: Gmail, Yahoo, etc.): ' emailservice
read -p 'Enter the SMTP Address for the Email Provider: ' emailsmtp
read -p 'Enter the Admin Email ID(Can be Anything or can be Same as the Above Email ID): ' adminemail
read -p 'Confirm the Before Email Again: ' replyemail
read -p 'Enter the Number of Maximum Active Sessions that Users can Login Simultaneously(Eg: 1, 2, 5, etc.): ' maxsessions
read -p 'Enter the Image Link for Displaying in Emails: ' emailgif
read -p 'Enter a Secret Key that you will Remember (Should be Used while Creating a Superadmin Account after this Setup): ' sitesec
read -p 'Enter the TMDB API Key for Metadata Info of Media in the Index (If You Don\t Need, put NaN): ' tmdbapi
read -p 'Enter the Frontend Url/Urls (Dont Put trailing / at the end) (Multiple Frontends can be Put Here by putting a ,): ' fronturls
read -p 'Enter the Frontend Website Name (Can be Anything): ' frontname
read -p 'Enter a Super Long Token Secret that will be Used to Secure the JWT Tokens.(These are Never Required to be Remebered): ' tokensec
echo -e "\n"
echo 'Pushing Config Keys to Heroku App'
echo -e "\n"
heroku config:set -a $appname DBURL=$dburl SITE=$site EMAILID=$emailid EMAILPASS=$emailpass EMAILPORT=$emailport EMAILSERVICE=$emailservice EMAILSMTP=$emailsmtp ADMINEMAIL=$adminemail REPLYTOMAIL=$replyemail MAXSESSIONS=$maxsessions EMAILGIF=$emailgif SITESECRET=$sitesec TMDBAPI=$tmdbapi FRONTENDURL=$fronturls FRONTENDSITENAME=$frontname TOKENSECRET=$tokensec
read -p "Press [Enter] key to exit..."
exit
