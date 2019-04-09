**DEPRECATED: Use [webrtc-bootstrap](https://github.com/elavoie/webrtc-bootstrap) instead.**

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

## API

### Server(secret, opts)

`secret` is an alphanumeric string that is used by the client to connect as root.

`opts` is an optional object with the default values:

    {
        public: null,
        timeout: 30 * 1000 // ms,
        httpServer: null,
        port: 5000,
        seed: null
    }

`opts.public` is the path to the public directory for serving static content.

`opts.timeout` is the maximum allowed time for a candidate to successfully join the network.

`opts.httpServer` is an existing http server.

`opts.port` is the port used by the http server if none has been provided.

`opts.seed` is a number to use as a seed for the pseudo-random generation of channel ids. If null, the crypto.randomBytes method is used instead.
