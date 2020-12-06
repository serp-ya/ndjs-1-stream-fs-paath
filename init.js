const fs = require('fs');
const path = require('path');

fs.chmodSync(
    path.resolve(__dirname, 'src', 'index.js'),
    '0775',
);