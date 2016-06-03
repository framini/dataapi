import { defaults } from 'lodash';
import component from './componentparser';

function start() {
}

function stop() {
}

function getInitializedComponents() {
}

export default function dataapi(cfg) {
  const config = defaults(cfg, {
    parentSelector: 'body',
    namespaces: ['api'],
  });
  const c1 = component(config);

  c1.parseComponents();

  return {
    start,
    stop,
    getInitializedComponents,
  };
}
