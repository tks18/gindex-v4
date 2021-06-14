#!/usr/bin/env bash

printf "\nDoing After Deployment Activities\n"

GIT_URL="github.com/tks18/gindex-v4.git"
FT_DEPLOY_DIR="ft-deploy-tmp"
BE_DEPLOY_DIR="be-deploy-tmp"
CLI_DEPLOY_DIR="cli-deploy-tmp"

git config --global user.name "tks18"
git config --global user.email "tksudharshan@gmail.com"

printf "\nPublishing Frontend\n"
git clone -b frontend https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${FT_DEPLOY_DIR}
cd ${FT_DEPLOY_DIR}
git rm -r .
git add .
git commit -m "Preparing for Frontend Deploy: ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
cp -v -r ../vuejs/. .
git add .
git commit -m "Deploying Frontend for ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push origin frontend

rm -rf ${FT_DEPLOY_DIR}/*

printf "\nPublishing Backend\n"
git clone -b backend https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${BE_DEPLOY_DIR}
cd ${BE_DEPLOY_DIR}
git rm -r .
git add .
git commit -m "Preparing for Backend Deploy: ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
cp -v -r ../backend/. .
git add .
git commit -m "Deploying Backend for ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push origin backend

rm -rf ${BE_DEPLOY_DIR}/*

printf "\nPublishing CLI Tool\n"
git clone -b cli-tool https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${CLI_DEPLOY_DIR}
cd ${CLI_DEPLOY_DIR}
git rm -r .
git add .
git commit -m "Preparing for CLI-Tool Deploy: ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
cp -v -r ../cli-tool/. .
git add .
git commit -m "Deploying CLI-Tool for ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push origin cli-tool

rm -rf ${CLI_DEPLOY_DIR}/*