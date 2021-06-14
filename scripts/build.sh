#!/usr/bin/env bash

cd vuejs
printf ".\n.\n.\n.\n.\n"
printf "Setting Default Environment Variables"
export VUE_APP_I18N_LOCALE=zh-chs
export VUE_APP_I18N_FALLBACK_LOCALE=en
export VUE_APP_SECRET_PASS=${SECRET_PASS}
export VUE_APP_CDN_PATH=https://cdn.jsdelivr.net/gh/tks18/gindex-v4@master/vuejs/outputs/THEME/
printf "\n"
printf "Getting Latest themes and Variants"
themes_list = ("gradient-carnation" "gradient-curious-blue" "gradient-emerald" "gradient-ice-cold" "gradient-konifer" "gradient-netflix-red" "gradient-kournikova" "gradient-mona-lisa" "gradient-persian-rose" "gradient-purple-heart" "gradient-purple-mountains-majesty" "gradient-salmon" "gradient-selective-yellow" "gradient-shamrock" "gradient-witch-haze" "black-carnation" "black-curious-blue" "black-emerald" "black-ice-cold" "black-konifer" "black-netflix-red" "black-kournikova" "black-mona-lisa" "black-persian-rose" "black-purple-heart" "black-purple-mountains-majesty" "black-salmon" "black-selective-yellow" "black-shamrock" "black-witch-haze")

export VUE_APP_THEME="gradient-carnation"
printf "\nBuilding Assets for gradient-carnation\n\n"
ls
mkdir -p ./outputs/themes/gradient-carnation
yarn build
cd outputs
ls
cd ..
mv -v ./dist/* ./outputs/themes/gradient-carnation/.
cd outputs
ls
cd themes
ls
cd gradient-carnation
ls

# for theme in ${themes_list[@]}; do
    
# done