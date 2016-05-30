var context = require.context("./app", true, /\S+\/test\/\S+\.js$/);
context.keys().forEach(context);
