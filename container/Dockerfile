
# Add a FROM for the tap-base image to we can copy content from it
ARG KEG_NODE_VERSION
ARG KEG_NODE_IMAGE=node:$KEG_NODE_VERSION
FROM $KEG_NODE_IMAGE as keg-node-proxy

# Ensure the app path is set within the FROM scope
ARG DOC_APP_PATH
ENV DOC_APP_PATH=$DOC_APP_PATH

# Set the current directory to tap repo
WORKDIR $DOC_APP_PATH

# Set the max-listenrs, and install the dependecies with yarn install
RUN apk add git bash; \
    echo fs.inotify.max_user_watches=1048576 | tee -a /etc/sysctl.conf; \
    sysctl -p; \
    rm -rf /var/cache/apk/*; \
    /bin/sed -i '1s|.*|root:x:0:0:root:/root:/bin/bash|g' /etc/passwd; \
    yarn global add nodemon --pure-lockfile; \
    cd $DOC_APP_PATH; \
    yarn install --pure-lockfile; \
    yarn cache clean

# Proxy ports exposed by docker
ARG PROXY_INSECURE_PORT=80
ARG PROXY_SECURE_PORT=443
ARG PROXY_DASHBOARD_PORT=18001
ARG PROXY_HEALTHCHECK_PORT=8080
EXPOSE $PROXY_INSECURE_PORT
EXPOSE $PROXY_SECURE_PORT
EXPOSE $PROXY_DASHBOARD_PORT
EXPOSE $PROXY_HEALTHCHECK_PORT

# Run the start script
CMD [ "/bin/bash", "container/run.sh" ]
