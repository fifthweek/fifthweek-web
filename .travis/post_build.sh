
git config --global user.email "services@fifthweek.com"
git config --global user.name "TravisCI"

mkdir $HOME/temp_dist

echo Cloning fifthweek-web-dist
git clone -b master git@github.com:fifthweek/fifthweek-web-dist.git $HOME/temp_dist

echo Clearing files
rm -rf $HOME/temp_dist/*

echo Copying new files
cp -rf dist/* $HOME/temp_dist/

# Use to troubleshoot render issues.
# Change .travis.yml to run this on
# `after_script` instead of `after_success`
#
# mkdir $HOME/temp_dist/tmp
# cp -rf test/screenshots $HOME/temp_dist/tmp/

echo Changing directory
cd $HOME/temp_dist
pwd

echo Pushing new files to fifthweek-web-dist
git add -A
git commit -m "Travis build $TRAVIS_BUILD_NUMBER from fithweek-web"
git push git@github.com:fifthweek/fifthweek-web-dist.git $TRAVIS_COMMIT
