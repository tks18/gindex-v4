#!/usr/bin/env bash

GIT_URL="github.com/tks18/gindex-v4.git"
DEPLOY_DIR="deploy-tmp"

git config --global user.name "tks18"
git config --global user.email "tksudharshan@gmail.com"

git clone --single-branch --depth 3 --quiet -b build https://tks18:${GITHUB_TOKEN}@${GIT_URL} ${DEPLOY_DIR}
cd ${DEPLOY_DIR}
rm -rf *
cp -r ../vuejs/outputs/. .
mkdir worker
cp ../worker/. worker/.
git add .
git commit -m "Deploying ${TRAVIS_BUILD_ID}-${TRAVIS_BUILD_NUMBER}: ${TRAVIS_COMMIT}-${TRAVIS_COMMIT_MESSAGE}"
git push origin build