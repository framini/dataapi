import test from 'tape';
import component from '../../src/component';
import { forEach } from 'lodash';

test.skip('component exposes the expected API', t => {
  const cmp = component();
  t.equal(typeof cmp.parseComponents, 'function', 'parseComponents is a method');
  // t.equal(typeof cmp.selectComponents, 'function', 'selectComponents is a method');
  // t.equal(typeof cmp.parseComponentOptions, 'function', 'parseComponentOptions is a method');
  t.equal(typeof cmp.initComponent, 'function', 'initComponent is a method');

  t.end()
});

test('parseComponents method returns an array of components', t => {
  const cmp = component();
  // mock of a possible config object
  const config = {
    namespaces: ['bar', 'foo']
  };
  const content = [];
  // array to hold all the generated names for the components
  const cmpsNames = [];
  const amountCmps = [...Array(10).keys()];
  // helper variable to keep track of the number of components that shouldn't be parsed by the method
  let notToBeParsed = 0;

  // generates test data (in this case, an array of DOM elements)
  amountCmps.forEach(i => {
    const div = document.createElement('div');
    const randomIndex = Math.floor((Math.random() * config.namespaces.length));
    // grabs a random namespace from the passed config
    let ns = config.namespaces[randomIndex];
    // randonly generates namespaces that don't belong to the supported namespaces
    if (Math.floor(Math.random() * 20) + 1 < 10) {
      // this will generate a namespace that won't be present in config.namespaces
      ns = `${ns}${Date.now()}`;
      notToBeParsed++;
    }
    const compDef = `${ns}Component`;
    const objDef = `${ns}Obj`;
    const arrDef = `${ns}Arr`;
    const strDef = `${ns}Str`;
    const cmpName = `bar${Date.now()}`;
    cmpsNames.push(cmpName);
    div.dataset[compDef] = cmpName;
    div.dataset[objDef] = JSON.stringify({
      bar: 'foo',
      foo: 'baz'
    });
    div.dataset[arrDef] = JSON.stringify([1,2]);
    div.dataset[strDef] = 'baz';

    content.push(div);
    document.body.appendChild(div);
  });

  /**
   * the amount of components that should had been parsed would have to be
   * amountCmps.length minus the amount of components that have a namespace
   * that is not specified within config.namespaces
   */
  const goalParsedComponents = amountCmps.length - notToBeParsed;

  t.skip('selectComponents should return an array of DOM elements to be parsed', st => {
    const componentsToBeParsed = cmp.selectComponents(content);
    // checks if it is a Set
    // TODO: review if there is a better way to validate this
    st.equal(typeof componentsToBeParsed, 'object');
    st.equal(typeof componentsToBeParsed.add, 'function');
    st.equal(typeof componentsToBeParsed.has, 'function');
    // checks that we are only parsing components using the supported namespaces
    st.equal(componentsToBeParsed.size, goalParsedComponents);
    st.end();
  });

  t.skip('parseComponentOptions should return an object', st => {
    // this should return a set
    const componentsToBeParsed = cmp.selectComponents(content);
    const comps = [...componentsToBeParsed];
    // we are just going to pass only one component. in this case, the first parsed
    const parsedComponentOptions = cmp.parseComponentOptions(comps[0]);
    st.equal(componentsToBeParsed.length, parsedComponentOptions.length);

    // checks if it is a Map
    // TODO: review if there is a better way to validate this
    st.equal(typeof parsedComponentOptions, 'object');
    st.equal(typeof parsedComponentOptions.clear, 'function');
    st.equal(typeof parsedComponentOptions.set, 'function');

    parsedComponentOptions.forEach(cmp => {
      st.ok(cmp.name, 'the parsed component has a ´name´ property');
      st.ok(cmp.options, 'the parsed component has a ´options´ property');
      st.equal(typeof cmp.options, 'object', 'the options property should be an oject');
      // options API
      st.equal(typeof cmp.options.get, 'function');
      st.equal(typeof cmp.options.getEl, 'function');
      st.equal(typeof cmp.options.size, 'function');
      // the options obj should only include properties defined by the user through the data-* API
      st.equal(cmp.options.size, 'object', 'the options obj should have a lenght of 3');
      // supported types object, array and string
      st.equal(typeof cmp.options.get('obj'), 'object');
      st.equal(typeof cmp.options.get('arr'), 'array');
      st.equal(typeof cmp.options.get('str'), 'string');
      st.end();
    });

    st.end();
  });

  // t.equal(typeof parsedComponents, 'array');
  // t.equal(parsedComponents.length, goalParsedComponents);
  // checks if it is a Map
  // TODO: review if there is a better way to validate this
  t.equal(typeof parsedComponents, 'object');
  t.equal(typeof parsedComponents.clear, 'function');
  t.equal(typeof parsedComponents.set, 'function');
  t.equal(parsedComponents.length, goalParsedComponents);

  t.end();
});
