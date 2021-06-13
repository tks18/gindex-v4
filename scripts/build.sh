cd vuejs
printf ".\n.\n.\n.\n.\n"
printf "Setting Default Environment Variables"
export VUE_APP_I18N_LOCALE=zh-chs
export VUE_APP_I18N_FALLBACK_LOCALE=en
export VUE_APP_SECRET_PASS=${SECRET_PASS}
export VUE_APP_CDN_PATH=https://cdn.jsdelivr.net/gh/tks18/gindex-v4@master/vuejs/outputs/THEME/
printf "\n"
printf "Getting Latest themes and Variants"
themes=("carnation" "curious-blue" "emerald" "ice-cold" "konifer" "netflix-red" "kournikova" "mona-lisa" "persian-rose" "purple-heart" "purple-mountains-majesty" "salmon" "selective-yellow" "shamrock" "witch-haze")
variants=("black" "gradient")
printf "\n" 
printf "Populating Themes"
declare -a themes_list

for theme in ${themes[@]}; do
    for variant in ${variants[@]}; do
        themes_list+=("${variant}-${theme}")
    done
done

export VUE_APP_THEME=${themes_list[0]}
printf "\nBuilding Assets for ${themes_list[0]}\n\n"
parent_dir="outputs/themes"
theme_dir="${parent_dir}/${themes_list[0]}"
printf $theme_dir
mkdir -p $theme_dir
yarn build
cp -r ./dist/. "$theme_dir/."
cd outputs
ls
cd ..

# for theme in ${themes_list[@]}; do
    
# done