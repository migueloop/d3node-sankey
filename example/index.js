const output = require('d3node-output');
const sankey = require('../');
const data = require('foo.json')

// create output files
output('./example/output', sankey(data));
