git config --global user.email "services@fifthweek.com"
git config --global user.name "$TRAVIS_COMMIT_AUTHOR"

mkdir $HOME/temp_reports

echo Cloning fifthweek-web-build-failure-reports
git clone -b $TRAVIS_BRANCH git@github.com:fifthweek/fifthweek-web-build-failure-reports.git $HOME/temp_reports

echo Clearing files
rm -rf $HOME/temp_reports/*

echo Copying new files
cp -rf reports/* $HOME/temp_reports/

# Use to troubleshoot render issues.
# Change .travis.yml to run this on
# `after_script` instead of `after_success`
#
# mkdir $HOME/temp_reports/tmp
# cp -rf test/screenshots $HOME/temp_reports/tmp/

echo Changing directory
cd $HOME/temp_reports
pwd

echo Pushing new files to fifthweek-web-build-failure-reports
git add -A
git commit -m "$TRAVIS_COMMIT_MSG - $TRAVIS_BUILD_NUMBER"
git push git@github.com:fifthweek/fifthweek-web-build-failure-reports.git $TRAVIS_BRANCH
