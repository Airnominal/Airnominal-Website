# Airnominal Website

A website for managing Airnominal stations.

## About

Written in TypeScript using Vue and Vuetify frameworks. Provides an interface for registering and managing stations.

## Usage

### Dependencies

Dependencies should be installed with Yarn.

When running the website, the Airnominal API must also be running on the correct port.

### Development Server

Development server can be started using:

```bash
yarn serve
```

This will automatically build the website and start the server. It includes automatic hot reloading, code linting and support for single page apps.

### Building for Production

Website can be built for production using:

```bash
yarn build
```

It will build whole website, optimized for production and save it into `dist` directory. This will also include all assets and service worker file.

### Hosting for Production

The website uses Vue Router in `history` mode, so a simple static file server will fail. You will need to configure your web server to fall back to `index.html` for any non-file requests. See [Vue Documentation](https://cli.vuejs.org/guide/deployment.html) for more details.

We also provide a pre-built Docker image with the server, configured to use the official API. However, please note that using official API on local instances might not work due to CORS.
