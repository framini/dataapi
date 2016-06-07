import { defaults } from 'lodash';
import componentParser from './componentparser';
import componentHandler from './componenthandler';

function start(cfg) {
  const { internalCache } = cfg;
  const call = new Promise((resolve, rejected) => {
    const config = defaults(cfg, {
      resolve,
      rejected,
    });
    let components;

    // if the componets were passed as an argument, we'll use that instead
    if (config.components === undefined) {
      config.components = componentParser(config).parseComponents();
    }

    try {
      components = componentHandler(config);
      internalCache.set('componentHandler', components);
      const initializedComponents = components.getInitializedComponents();
      resolve(initializedComponents);
    } catch (e) {
      rejected(e);
    }
  });

  return call;
}

function stop(config) {
  const call = new Promise((resolve, rejected) => {
    const { internalCache } = config;
    const compHandler = internalCache.get('componentHandler');

    if (compHandler === undefined) {
      throw new Error(`Whether you are calling .stop() before .start() or there
      aren\'t any component to stop`);
    }

    try {
      compHandler.stopComponents();
      resolve(true);
    } catch (e) {
      rejected(e);
    }
  });

  return call;
}

function getInitializedComponents(config) {
  const call = new Promise((resolve, rejected) => {
    const { internalCache } = config;
    const compHandler = internalCache.get('componentHandler');

    if (compHandler === undefined) {
      throw new Error(`Whether you are calling .getInitializedComponents() before .start() or there
      aren\'t any component to stop`);
    }

    try {
      resolve(compHandler.getInitializedComponents());
    } catch (e) {
      rejected(e);
    }
  });

  return call;
}

function getSkippedComponents(config) {
  const call = new Promise((resolve, rejected) => {
    const { internalCache } = config;
    const compHandler = internalCache.get('componentHandler');

    if (compHandler === undefined) {
      throw new Error(`Whether you are calling .getSkippedComponents() before .start() or there
      aren\'t any component to stop`);
    }

    try {
      resolve(compHandler.getSkippedComponents());
    } catch (e) {
      rejected(e);
    }
  });

  return call;
}

export default function dataapi(cfg) {
  // this one will be exposed to the end user
  const cache = new Map();
  // this one will be private to the module
  const internalCache = new Map();
  const config = defaults(cfg, {
    factories: undefined, // required prop
    parentSelector: 'body',
    namespaces: ['api'],
    cache,
    internalCache,
    shared: undefined // shared Map to store shared functionality
  });

  return {
    start: start.bind(null, config),
    stop: stop.bind(null, config),
    getInitializedComponents: getInitializedComponents.bind(null, config),
    getSkippedComponents: getSkippedComponents.bind(null, config),
  };
}
