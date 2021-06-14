#!/usr/bin/env sh

build_type="$1"
GIT_URL="github.com/tks18/gindex-v4.git"
DEPLOY_DIR="deploy-tmp"

git config --global user.name "tks18"
git config --global user.email "tksudharshan@gmail.com"

if [ $build_type == "dev" ] 
then
    git clone -b dev-build https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${DEPLOY_DIR}
    cd ${DEPLOY_DIR}
    git rm -r .
    git add .
    git commit -m "Preparing to Deploy ${TRAVIS_BUILD_ID}-${TRAVIS_BUILD_NUMBER}: ${TRAVIS_COMMIT}"
    cp -v -r ../vuejs/outputs/. .
    git add .
    git commit -m "Deploying ${TRAVIS_BUILD_ID}-${TRAVIS_BUILD_NUMBER}: ${TRAVIS_COMMIT}"

elif [ $build_type == "production" ]
then   
    git clone -b build https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${DEPLOY_DIR}
    cd ${DEPLOY_DIR}
    git rm -r .
    git add .
    git commit -m "Preparing to Deploy ${TRAVIS_BUILD_ID}-${TRAVIS_BUILD_NUMBER}: ${TRAVIS_COMMIT}"
    cp -v -r ../vuejs/outputs/. .
    git add .
    git commit -m "Deploying ${TRAVIS_BUILD_ID}-${TRAVIS_BUILD_NUMBER}: ${TRAVIS_COMMIT}"
fi