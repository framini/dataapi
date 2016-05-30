var context = require.context("./test", true, /\S+\/unit\/\S+\.js$/);
context.keys().forEach(context);
