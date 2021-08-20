#!/usr/bin/env

# Ensure required envs are set
[[ -z "$DOC_APP_PATH" ]] && DOC_APP_PATH=/keg/tap

# If the no KEG_DOCKER_EXEC env is set, just sleep forever
# This is to keep our container running forever
[[ -z "$KEG_DOCKER_EXEC" ]] && tail -f /dev/null && exit 0;

# Serve the app bundle in development environemnts
echo $"[ KEG-CLI ] Running proxy server!" >&2
cd $DOC_APP_PATH
[[ -z "$KEG_EXEC_CMD" ]] && yarn proxy || yarn $KEG_EXEC_CMD
