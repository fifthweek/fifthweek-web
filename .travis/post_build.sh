
mkdir $HOME/temp_dist
git clone -b master git@github.com:fifthweek/fifthweek-web-dist.git $HOME/temp_dist

rm -rf $HOME/temp_dist/* > /dev/null

cp -rf dist/* $HOME/temp_dist/

# Use to troubleshoot render issues.
# Change .travis.yml to run this on
# `after_script` instead of `after_success`
#
# mkdir $HOME/temp_dist/tmp
# cp -rf test/screenshots $HOME/temp_dist/tmp/

cd $HOME/temp_dist

git add -A
git commit -m "Travis build $TRAVIS_BUILD_NUMBER from fithweek-web"
git push git@github.com:fifthweek/fifthweek-web-dist.git master