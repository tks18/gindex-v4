#!/usr/bin/env bash

cd vuejs
printf ".\n.\n.\n.\n.\n"
printf "Setting Default Environment Variables"
export VUE_APP_SECRET_PASS=${SECRET_PASS}
export VUE_APP_BUILD="prod"
export VUE_APP_LOCAL=false
export VUE_APP_CDN_PATH=https://cdn.jsdelivr.net/gh/tks18/gindex-v4@master/themes/THEME/
printf "\n"
printf "Getting Latest themes and Variants"
themes_list=("carnation" "curious-blue" "emerald" "ice-cold" "konifer" "netflix-red" "kournikova" "mona-lisa" "persian-rose" "purple-heart" "purple-mountains-majesty" "salmon" "selective-yellow" "shamrock" "witch-haze")

printf "\nDeleting old Builds\n\n"
rm -rf outputs/*
dest_dir="outputs/themes"
mkdir -p dest_dir

for theme in ${themes_list[@]}; do
    export VUE_APP_THEME=${theme}
    printf "\nBuilding Assets for ${theme}\n\n"
    theme_dir="${dest_dir}/${theme}"
    mkdir -p ${theme_dir}
    yarn build --silent
    mv ./dist/* ${theme_dir}/.
done