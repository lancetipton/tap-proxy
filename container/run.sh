#!/usr/bin/env

# Ensure required envs are set
[[ -z "$DOC_APP_PATH" ]] && DOC_APP_PATH=/keg/tap

# Serve the app bundle in development environemnts
echo $"[ KEG-CLI ] Running proxy server!" >&2
cd $DOC_APP_PATH
[[ -z "$KEG_EXEC_CMD" ]] && yarn proxy || yarn $KEG_EXEC_CMD
