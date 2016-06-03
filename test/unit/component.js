import test from 'tape';
import component from '../../src/componentparser';

test('component exposes the expected API', t => {
  const cmp = component();
  t.equal(typeof cmp.parseComponents, 'function', 'parseComponents is a method');
  t.equal(typeof cmp.__selectComponents, 'function', '__selectComponents is a method');
  t.equal(typeof cmp.__parseComponentOptions, 'function', '__parseComponentOptions is a method');
  t.equal(typeof cmp.getParsedComponents, 'function', 'getParsedComponents is a method');

  t.end();
});

test('parseComponents method returns a Map of components', t => {
  // mock of a possible config object
  const config = {
    namespaces: ['bar', 'foo'],
  };
  const cmp = component(config);
  const content = [];
  // array to hold all the generated names for the components
  const cmpsNames = [];
  const amountCmps = [...Array(10).keys()];
  // helper variable to keep track of the number of components that shouldn't be
  // parsed by the method
  let notToBeParsed = 0;

  // generates test data (in this case, an array of DOM elements)
  amountCmps.forEach(() => {
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
      foo: 'baz',
    });
    div.dataset[arrDef] = JSON.stringify([1, 2]);
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

  t.test('__selectComponents should return an array of DOM elements to be parsed', st => {
    // test the 2 different ways of using this method. Passing an array of DOM elem or
    // passing a selector
    const componentsToBeParsedUsingContent = cmp.__selectComponents({
      namespaces: config.namespaces,
      content,
    });
    const componentsToBeParsedUsingSelector = cmp.__selectComponents({
      namespaces: config.namespaces,
    });

    // checks if it is a Set
    // TODO: review if there is a better way to validate this
    st.equal(typeof componentsToBeParsedUsingContent, 'object');
    st.equal(typeof componentsToBeParsedUsingContent.add, 'function');
    st.equal(typeof componentsToBeParsedUsingContent.has, 'function');
    // checks that we are only parsing components using the supported namespaces
    st.equal(componentsToBeParsedUsingContent.size, goalParsedComponents);

    // checks if it is a Set
    // TODO: review if there is a better way to validate this
    st.equal(typeof componentsToBeParsedUsingSelector, 'object');
    st.equal(typeof componentsToBeParsedUsingSelector.add, 'function');
    st.equal(typeof componentsToBeParsedUsingSelector.has, 'function');
    // checks that we are only parsing components using the supported namespaces
    st.equal(componentsToBeParsedUsingSelector.size, goalParsedComponents);

    st.end();
  });

  t.test('__parseComponentOptions should return an object', st => {
    // this should return a set
    const componentsToBeParsed = cmp.__selectComponents({
      namespaces: config.namespaces,
      content,
    });
    const comps = [...componentsToBeParsed];
    // we are just going to pass only one component. in this case, the first parsed
    const parsedComponentOptions = cmp.__parseComponentOptions(comps[0]);

    st.equal(typeof parsedComponentOptions, 'object');
    st.ok(parsedComponentOptions.name, 'the parsed component has a ´name´ property');
    st.ok(parsedComponentOptions.options, 'the parsed component has a ´options´ property');
    // checks if it is a Map
    // TODO: review if there is a better way to validate this
    st.equal(typeof parsedComponentOptions.options, 'object');
    st.equal(typeof parsedComponentOptions.options.clear, 'function');
    st.equal(typeof parsedComponentOptions.options.set, 'function');
    st.equal(parsedComponentOptions.options.size, 3, 'the options obj should have a lenght of 3');
    // supported types object, array and string
    st.equal(typeof parsedComponentOptions.options.get('obj'), 'object');
    st.ok(Array.isArray(parsedComponentOptions.options.get('arr')));
    st.equal(typeof parsedComponentOptions.options.get('str'), 'string');

    st.end();
  });

  t.test('parsedComponents should return a Map', st => {
    const parsedComponents = cmp.parseComponents(config);
    // checks if it is a Map
    // TODO: review if there is a better way to validate this
    st.equal(typeof parsedComponents, 'object');
    st.equal(typeof parsedComponents.clear, 'function');
    st.equal(typeof parsedComponents.set, 'function');
    // checks that we are only parsing components using the supported namespaces
    st.equal(parsedComponents.size, goalParsedComponents);

    st.end();
  });

  t.skip('initComponent should initialize the parsed components', st => {
    const initCmps = cmp.parseComponents(config);

    st.equal(initCmps, cmp.getParsedComponents());
    st.end();
  });

  t.end();
});
