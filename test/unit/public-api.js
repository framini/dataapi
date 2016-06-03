import test from 'tape';
import dataapi from '../../src/dataapi';

test('public API matches expectaction', t => {
  const da = dataapi();
  t.equal(typeof da.stop, 'function', 'stop is a method');
  t.equal(typeof da.start, 'function', 'start is a method');
  t.equal(typeof da.getInitializedComponents, 'function', 'getInitializedComponents is a method');
  t.end();
});
