#!/usr/bin/env bash

cd version-manager
npm i

repo=https://github.com/tks18/gindex-v4

printf "Publishing Frontend"
node . publish --repo ${repo} --branch build --type frontend

printf "Publishing Backend"
node . publish --repo ${repo} --branch backend --type backend

printf "Publishing CLI Tool"
node . publish --repo ${repo} --branch cli-tool --type clitool

printf "Publishing Version Manager Tool"
node . publish --repo ${repo} --branch version-manager-dev --type versionmanager