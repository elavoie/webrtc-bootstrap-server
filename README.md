[![Build Status](https://travis-ci.org/elavoie/webrtc-bootstrap-server.svg?branch=master)](https://travis-ci.org/elavoie/webrtc-bootstrap-server)

# Bootstrap server

Server for the [webrtc-bootstrap](https://github.com/elavoie/webrtc-bootstrap) library.

The server can be run locally for tests or deployed on any public server
(server with a public IP address) that supports WebSockets.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Usage

    # Using the configuration file
    node bin/server path_to_config.json

    # Or using environment variables
    SECRET=12345 node bin/server

## Secret configuration

Please clone this repository, copy config.example.json to config.json, and
change the secret in the config.json file to ensure only your root node can
connect as root to the bootstrap server.
