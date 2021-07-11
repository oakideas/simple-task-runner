const watsonNLUKey = require('../credentials.json').watson.nlu;

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

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
            console.log(expression)
            sentence = eval(expression)
        } else {
            sentence = sentenceObj;
        }

        console.log('>> fetching sentence: ' + sentence);
        resolve()
        return;
        try {
            const response = await nlu.analyze({
                text: sentence,
                features: {
                    concepts: {},
                    keywords: {},
                    sentiment: {}
                }
            })

            console.log(JSON.stringify(response, null, 2));

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