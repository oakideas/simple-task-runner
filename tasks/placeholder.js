const logger = require('../util/Logger')

async function placeholder(basePath, params, currentData) {

    return new Promise(async (resolve, reject) => {
        logger.log(`placeholder ${params['message']}`);
        resolve();
    })

}

module.exports = {
    placeholder
}