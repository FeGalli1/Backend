'use strict'

import { readdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { removeExtensionFilename } from '../utils/helpers.js'
import {  Router  } from 'express';

const router = Router();
const PATH_ROUTES = dirname(`${import.meta.url}`).split('file:///')[1];
readdirSync(PATH_ROUTES).filter((filename) => {
  const routerFilename = removeExtensionFilename(filename);
  if (routerFilename !== 'index') {
    import(`./${routerFilename}.js`).then((routerModule) => {
      router.use(`/${routerFilename}`, routerModule.router);
    });
  }
});
export { router };
