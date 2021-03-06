# Ville

A user input-based procedural city generator, built for my Digital Media Design Senior Project (CIS497) in the fall of 2018.

## Local Development

Ville uses [Parcel](https://parceljs.org) to bundle resources. For development, run `npm run dev`, which will build, watch, and serve the app at `localhost:1234`. (You may need to run `npx parcel index.html` if the first command doesn't work.)

## Deploying

Ville is deployed from the [`dist`](dist) folder. To ensure that `dist` has the correct resources, run `npm run build`. The most important distinction between this and `npm run dev` is that `build` sets the public URL to be `ville/[resource]`, which is necessary for my current URL structure.

To deploy the `dist` folder, run `npm run deploy`. This pushes the `dist` folder to the `gh-pages` branch, which is the source branch for the published app.

## Credits
The road generation and building placement implementations are adapted from [citygen](https://github.com/t-mw/citygen). The noise functions are adapted from [noisejs](https://github.com/josephg/noisejs).

The only production dependency that Ville uses is [three.js](https://threejs.org).
