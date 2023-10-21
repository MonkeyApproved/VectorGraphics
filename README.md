# Vector Graphics App

Running version of the app can be found on [GitHub Pages](https://monkeyapproved.github.io/VectorGraphics/).

## Deploy latest version

In order to deploy the latest version of the app to GitHub pages, you can simply run

```bash
yarn install
yarn run deploy
```

If you first want to try out the production build locally, you can run

```bash
yarn run build
cd build/
python3 -m http.server 8080
```

This will launch a simple web server, that will serve the build version of the app.

## Central Redux Store

One of the main design decisions was to manage all data in one central redux store.
The data-store is split into three parts, that focus on different aspects of the application.

### SVG

Here we store the data fro all SVG elements (position, size, styles and other SVG attributes)

### Events

Used to track any user input in the from of ouse events.

### Equations

All values in the app can either be inserted as plain numbers or as equations, which can then also reference
any other equation in the app.

bob
