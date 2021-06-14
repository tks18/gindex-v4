#!/usr/bin/env bash

GIT_URL="github.com/tks18/gindex-v4.git"
DEPLOY_DIR="deploy-tmp"

git config --global user.name "tks18"
git config --global user.email "tksudharshan@gmail.com"

git clone -b build https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${DEPLOY_DIR}
cd ${DEPLOY_DIR}
rm -rf *
git add .
git commit -m "Preparing to Deploy ${TRAVIS_BUILD_ID}-${TRAVIS_BUILD_NUMBER}: ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
cp -v -r ../vuejs/outputs/. .
git add .
git commit -m "Deploying ${TRAVIS_BUILD_ID}-${TRAVIS_BUILD_NUMBER}: ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push origin build

cd ..
rm -rf vuejs/*
rm -rf ${DEPLOY_DIR}/*