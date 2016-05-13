#!/bin/bash -eux
CURR_VERSION=$(awk '/^version/{print $3}' setup.cfg)

# get pypi and gpg creds in place
mv $PYPIRC_FILE ~/.pypirc
tar -zxvf $GNUPG_TAR -C ~/

echo 'CURR_VERSION=' $CURR_VERSION
git tag -s $CURR_VERSION -m $CURR_VERSION -u "Big Switch Networks"
python setup.py sdist upload -r pypi

# remove pypi and gpg creds
rm ~/.pypirc
rm -rf ~/.gnupg
