# Add a FROM for the proxy image to we can copy content from it
ARG KEG_NODE_IMAGE=node:14.7-alpine
FROM $KEG_NODE_IMAGE as keg-proxy

# Ensure the app path is set within the FROM scope
ARG DOC_APP_PATH=/keg/tap
ENV DOC_APP_PATH=$DOC_APP_PATH

# Set the current directory to tap repo
WORKDIR $DOC_APP_PATH

# Set the max-listenrs, and install the dependecies with yarn install
RUN apk add bash; \
    echo fs.inotify.max_user_watches=1048576 | tee -a /etc/sysctl.conf; \
    sysctl -p; \
    rm -rf /var/cache/apk/*; \
    yarn global add nodemon --pure-lockfile

# Proxy ports exposed by docker
ARG KEG_PROXY_SERVER_PORT=80
EXPOSE $KEG_PROXY_SERVER_PORT

# Run the start script
ARG KEG_EXEC_CMD=proxy
ENV KEG_EXEC_CMD=$KEG_EXEC_CMD

# ---------- Notes ---------- #
# The following allows for keg-proxy code to change,
# but keeps the node_modules folder cached
# This way if the image is rebuilt,
# if the node_modules have not change, it will use the docker cached instead of reinstalling

# Copy over the package.json and install node_modules
# To a temp directory
COPY ./package.json /key-temp/package.json
RUN mkdir -p /key-temp; \
    cd /key-temp; \
    yarn install --pure-lockfile; \
    yarn cache clean

# Then copy  over the reset of the code
# and copy in the installed node_modules
COPY . .
RUN cp -R /key-temp/. .; \
    rm -rf /key-temp
# ---------- Notes ---------- #

CMD ["/bin/bash", "container/run.sh"]
