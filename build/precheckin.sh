pwd
git clean -fxd
tox --version
sudo pip install --upgrade 'tox==2.3.1'
tox -e pep8
setup_cfg_modified=`git log -m -1 --name-only --pretty="format:" | grep setup.cfg | wc -l`
if [ ${setup_cfg_modified} -ne 1 ];
  then echo "Update setup.cfg with new version number.";
  exit 1;
else
  echo "All is Well."; fi
# check the new_version > old_version
git log -m -1 ${GIT_COMMIT} -p setup.cfg | grep version | python build/is_version_bumped.py
