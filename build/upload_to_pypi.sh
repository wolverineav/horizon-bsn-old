# get pypi and gpg creds in place
mv $PYPIRC_FILE ~/.pypirc
tar -zxvf $GNUPG_TAR -C ~/

CURR_VERSION=$(awk '/^version/{print $3}' setup.cfg)
echo 'CURR_VERSION=' $CURR_VERSION
# git tag release
git tag -s $CURR_VERSION -m $CURR_VERSION -u "Big Switch Networks"
# upload to pypi
python setup.py sdist upload -r pypi

# remove pypi and gpg creds
rm ~/.pypirc
rm -rf ~/.gnupg
