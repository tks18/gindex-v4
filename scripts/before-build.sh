#!/usr/bin/env bash

if [[ ${TRAVIS_BRANCH} == "master" ]] && [[ ${TRAVIS_PULL_REQUEST} == "false" ]]
then
    bash ./scripts/prod-build.sh
else
    bash ./scripts/dev-build.sh