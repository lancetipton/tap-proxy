#!/usr/bin/env

# Ensure required envs are set
[[ -z "$DOC_APP_PATH" ]] && DOC_APP_PATH=/keg/tap


# Serve the app bundle in development environemnts
cd $DOC_APP_PATH
[[ -z "$KEG_EXEC_CMD" ]] && KEG_EXEC_CMD=proxy

yarn $KEG_EXEC_CMD >> /proc/1/fd/1 &

# If the no KEG_DOCKER_EXEC env is set, just sleep forever
# This is to keep our container running forever
[[ -z "$KEG_DOCKER_EXEC" ]] && tail -f /dev/null && exit 0;