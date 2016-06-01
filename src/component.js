import { forEach } from 'lodash';

function initComponent() {
}

function getInitializedComponents() {
}

function parseComponents() {
}

function __selectComponents(options = {
  parentSelector: 'body',
  namespaces: ['aapi'],
}) {
  let collection = null;

  if (options) {
    if (options.content && options.content.length) {
      /**
       * filter the collection to contain elements within with the passed
       * namespace
       */
      collection = options.content.filter(el => {
        const ds = Object.assign({}, el.dataset);
        let allowedNamespace = false;

        forEach(ds, (v, k) => {
          allowedNamespace = allowedNamespace ||
                             options.namespaces.some(ns => k.startsWith(`${ns}Component`));
        });

        return allowedNamespace;
      });
    } else {
      const cssSelectors = [];
      let parentSelector;

      if (options.namespaces && Array.isArray(options.namespaces)) {
        options.namespaces.forEach(ns => {
          cssSelectors.push(`[data-${ns}-component]`);
        });
      }

      if (typeof options.parentSelector === 'string') {
        parentSelector = document.querySelector(options.parentSelector);
      }

      /**
       * in case we didn't find any parent element, we'll use the body as the default
       */
      if (parentSelector === null || parentSelector === undefined) {
        parentSelector = document.body;
      }

      collection = parentSelector.querySelectorAll(cssSelectors.join(','));
    }
  }

  if (collection) {
    collection = new Set([...collection]);
  }

  return collection;
}

function __getComponentNamespace(key) {
  const re = /[^A-Z]+/;
  const m = re.exec(key);

  return m[0].toLowerCase();
}

function __parseComponentOptions(el) {
  const ds = Object.assign({}, el.dataset);
  const options = new Map();
  let name;
  let namespace;

  if (ds) {
    forEach(ds, (val, k) => {
      let prop = '';
      let propLower = '';

      if (namespace === undefined) {
        namespace = __getComponentNamespace(k);
      }

      // removes the namespace
      prop = k.replace(new RegExp(`^${namespace}`), '');

      // decamelize the option name
      propLower = prop.charAt(0).toLowerCase() + prop.slice(1);

      // if the key is different from "component" it means it is an option value
      if (propLower !== 'component') {
        try {
          const o = JSON.parse(val);

          // Handle non-exception-throwing cases:
          // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
          // but... JSON.parse(null) returns 'null', and typeof null === "object",
          // so we must check for that, too.
          if (o && typeof o === 'object' && o !== null) {
            options.set(propLower, o);
          }
        } catch (e) {
          options.set(propLower, val);
        }
      } else {
        name = val;
      }
    });
  }

  return {
    name,
    el,
    options,
  };
}

export default function component() {
  return {
    initComponent,
    getInitializedComponents,
    parseComponents,
    __parseComponentOptions,
    __selectComponents,
  };
}
