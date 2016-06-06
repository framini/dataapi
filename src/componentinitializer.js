function getInitializedComponents(config) {
  return config.cache;
}

function __initComponents(config) {
  // all of them should be Maps
  const { factories, components, options, cache } = config;

  for (const [el, obj] of components) {
    const compName = obj.name;
    const factory = factories.get(compName);
    if (factory !== undefined) {
      const instance = factory(options);
      instance.init(obj);
      cache.set(el, instance);
    }
  }

  return cache;
}

export default function componentInitializer(cfg) {
  const config = Object.assign({}, {
    cache: new Map(),
  }, cfg);

  __initComponents(config);

  return {
    getInitializedComponents: getInitializedComponents.bind(null, config),
  };
}
