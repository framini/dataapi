function getInitializedComponents(config) {
  return config.internalCache.get('initializedComponents');
}

function getSkippedComponents(config) {
  return config.internalCache.get('skippedComponents');
}

function __initComponents(config) {
  // all of them should be Maps
  const { factories, components, internalCache, shared } = config;

  if (factories === undefined ||
      typeof factories !== 'object' ||
      typeof factories.has !== 'function') {
    throw new Error(`The factories property is required and it should be a Map. The key should
      be the name of the factory and the value a factory function`);
  }

  for (const [el, obj] of components) {
    const compName = obj.name;
    const factory = factories.get(compName);
    if (factory !== undefined) {
      const instance = factory(obj);
      instance.init(obj, shared);
      // this map is gonna keep track of initialized components for internal usage
      if (internalCache.get('initializedComponents') === undefined) {
        internalCache.set('initializedComponents', new Map());
      }
      internalCache.get('initializedComponents').set(el, instance);
    } else {
      // this map is gonna keep track of skipped components (i.e components that
      // were defined using a Factory function that hasn't been defined)
      if (internalCache.get('skippedComponents') === undefined) {
        internalCache.set('skippedComponents', new Map());
      }

      internalCache.get('skippedComponents').set(el, compName);
    }
  }

  return internalCache.get('initializedComponents');
}

function stopComponents(config) {
  const { internalCache } = config;
  const initializedComponents = internalCache.get('initializedComponents');

  for (const [el, instance] of initializedComponents) {
    // the stop method is not required at a component level, so we are gonna
    // be checking for existance before calling it
    if (typeof instance.stop === 'function') {
      instance.stop();
    }

    // Removes the instance from the Map of initialized components
    initializedComponents.delete(el);
  }

  return internalCache.get('initializedComponents');
}

export default function componentHandler(cfg) {
  const config = Object.assign({}, {
    internalCache: new Map(),
  }, cfg);

  __initComponents(config);

  return {
    getInitializedComponents: getInitializedComponents.bind(null, config),
    getSkippedComponents: getSkippedComponents.bind(null, config),
    stopComponents: stopComponents.bind(null, config),
  };
}
