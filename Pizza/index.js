'use strict'
var program = require('commander'),
    fs = require('fs'),
    parser = require('./modules/parser');

program
  .version('0.0.1')
  .option('-f, --file <file>', 'Device File')
  .parse(process.argv);


// We check the parameters
if (!program.file){
    console.error("Argument file missing ! ");
    return;
}

try {
    // We check if the file exists
    fs.accessSync(program.file, fs.F_OK);

    // We parse then we do the conversion
    parser.parse(program.file)
    .then((result)=>{
        require('./modules/processor').process(result);
    })
    .catch((msg)=>{
        console.error('Parse Error ! %s', msg);
    });

} catch (e) {
    console.error('File %s does not exists ! ', program.file);
    return;
}
