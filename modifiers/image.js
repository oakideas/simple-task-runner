const gm = require('gm').subClass({imageMagick: true});
const path = require('path')

function resize(basePath, params) {

    return new Promise((resolve, reject) => {
        const source = path.resolve(basePath, params['source'])
        const target = path.resolve(basePath, params['target'])
        const width = params['width']
        const height = params['height']
  
        gm()
          .in(source)
          .out('(')
            .out('-clone')
            .out('0')
            .out('-background', 'white')
            .out('-blur', '0x9')
            .out('-resize', `${width}x${height}^`)
          .out(')')
          .out('(')
            .out('-clone')
            .out('0')
            .out('-background', 'white')
            .out('-resize', `${width}x${height}`)
          .out(')')
          .out('-delete', '0')
          .out('-gravity', 'center')
          .out('-compose', 'over')
          .out('-composite')
          .out('-extent', `${width}x${height}`)
          .write(target, (error) => {
            if (error) {
              return reject(error);
            }
            resolve();
          });
  
      });
}

function crop() {

}

module.exports = {
    resize,
    crop
}