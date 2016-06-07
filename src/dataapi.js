import { defaults } from 'lodash';
import componentParser from './componentparser';
import componentHandler from './componenthandler';

function start(cfg) {
  const { cache, internalCache } = cfg;
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
    const componentHandler = internalCache.get('componentHandler');

    if (componentHandler === undefined) {
      throw new Error(`Whether you are calling .stop() before .start() or there
      aren\'t any component to stop`);
    }

    try {
      componentHandler.stopComponents();
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
    const componentHandler = internalCache.get('componentHandler');

    if (componentHandler === undefined) {
      throw new Error(`Whether you are calling .getInitializedComponents() before .start() or there
      aren\'t any component to stop`);
    }

    try {
      resolve(componentHandler.getInitializedComponents());
    } catch (e) {
      rejected(e);
    }
  });

  return call;
}

function getSkippedComponents(config) {
  const call = new Promise((resolve, rejected) => {
    const { internalCache } = config;
    const componentHandler = internalCache.get('componentHandler');

    if (componentHandler === undefined) {
      throw new Error(`Whether you are calling .getSkippedComponents() before .start() or there
      aren\'t any component to stop`);
    }

    try {
      resolve(componentHandler.getSkippedComponents());
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
    parentSelector: 'body',
    namespaces: ['api'],
    cache,
    internalCache
  });

  return {
    start: start.bind(null, config),
    stop: stop.bind(null, config),
    getInitializedComponents: getInitializedComponents.bind(null, config),
    getSkippedComponents: getSkippedComponents.bind(null, config),
  };
}
