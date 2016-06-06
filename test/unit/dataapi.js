import test from 'tape';
import dataapi from '../../src/dataapi';

test('dataapi exposes the expected API', t => {
  const d = dataapi({
    factories: new Map(),
  });
  t.equal(typeof d.start, 'function', 'start is a method');
  t.equal(typeof d.stop, 'function', 'stop is a method');
  t.equal(typeof d.getInitializedComponents, 'function', 'getInitializedComponents is a method');
  t.end();
});

test('all dataapi API method return a Promise', t => {
  const d = dataapi({
    factories: new Map(),
  });

  t.equal(typeof d.start(), 'object', 'start return a Promise');
  t.equal(typeof d.start().then, 'function');
  t.equal(typeof d.stop(), 'object', 'stop return a Promise');
  t.equal(typeof d.stop().then, 'function');
  t.equal(typeof d.getInitializedComponents(), 'object', 'getInitializedComponents return a Promise');
  t.equal(typeof d.getInitializedComponents().then, 'function');
  t.end();
});
