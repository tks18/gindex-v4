#!/usr/bin/env bash

printf "\nDoing After Deployment Activities\n"

GIT_URL="github.com/tks18/gindex-v4.git"
FT_DEPLOY_DIR="ft-deploy-tmp"
BE_DEPLOY_DIR="be-deploy-tmp"
CLI_DEPLOY_DIR="cli-deploy-tmp"

git config --global user.name "tks18"
git config --global user.email "tksudharshan@gmail.com"

printf "\nPublishing Frontend\n"
rm -rf vuejs/node_modules/*
rm -rf vuejs/.yarn/cache/*
rm -rf vuejs/outputs/*
git clone --single-branch --depth 3 --quiet -b frontend https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${FT_DEPLOY_DIR}
cd ${FT_DEPLOY_DIR}
rm -rf *
cp -r ../vuejs/. .
git add .
git commit -m "Deploying Frontend for ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push --quiet -u --no-progress origin frontend

cd ..
rm -rf ${FT_DEPLOY_DIR}/*

printf "\nPublishing Backend\n"
git clone --single-branch --depth 3 --quiet -b backend https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${BE_DEPLOY_DIR}
cd ${BE_DEPLOY_DIR}
rm -rf *
cp -r ../backend/. .
git add .
git commit -m "Deploying Backend for ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push --quiet -u --no-progress origin backend

cd ..
rm -rf ${BE_DEPLOY_DIR}/*

printf "\nPublishing CLI Tool\n"
git clone --single-branch --depth 3 --quiet -b cli-tool https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${CLI_DEPLOY_DIR}
cd ${CLI_DEPLOY_DIR}
rm -rf *
cp -r ../cli-tool/. .
git add .
git commit -m "Deploying CLI-Tool for ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push --quiet -u --no-progress origin cli-tool

cd ..

rm -rf ${CLI_DEPLOY_DIR}/*
rm -rf vuejs/*
rm -rf backend/*
rm -rf cli-tool/* 

printf "Successfully Deployed all the Modules"

