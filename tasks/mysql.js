const mysql = require('mysql-promisify').MySQL;
const logger = require('../util/Logger');
const util = require('util');

async function runQuery(basePath, params, currentData) {

    return new Promise(async (resolve, reject) => {

        const db = new mysql(params['connection']);

        const { results } = await db.query({
            sql: params['query'],
            params: params['params'],
          });

        params.task_output = {
            'results': results
        }
        
        logger.log(JSON.stringify(results));
        
        await db.end();
        resolve();
    })

}

module.exports = {
    runQuery
}