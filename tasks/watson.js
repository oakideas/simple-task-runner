const watsonNLUKey = require('../credentials.json').watson.nlu;

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const logger = require('./util/Logger')


const nlu = new NaturalLanguageUnderstandingV1({
    authenticator: new IamAuthenticator({ apikey: watsonNLUKey }),
    version: '2018-04-05',
    serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com'
  });

async function runNLU(basePath, params, currentData) {

    return new Promise(async (resolve, reject) => {

        const sentenceObj = params.text;

        let sentence;
        if (sentenceObj.type === 'reference') {
            const expression = 'currentData.' + sentenceObj.expression
            logger.log(expression)
            sentence = eval(expression)
        } else {
            sentence = sentenceObj;
        }

        logger.log('>> fetching sentence: ' + sentence);

        try {
            const response = await nlu.analyze({
                text: sentence,
                features: {
                    concepts: {},
                    keywords: {},
                    sentiment: {}
                }
            })

            logger.log(JSON.stringify(response, null, 2));

            params.task_output = {
                'response': response
            }

            resolve()
        } catch (err) {
            reject('error: ', err);
        }
    })

}

module.exports = {
    runNLU
}