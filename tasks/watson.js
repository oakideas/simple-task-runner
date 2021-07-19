const fs = require('fs')
const path = require('path')

const watsonNLUKey = require('../credentials.json').watson.nlu;
const watsonSTTKey = require('../credentials.json').watson.stt;

const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const logger = require('../util/Logger');

const nlu = new NaturalLanguageUnderstandingV1({
    authenticator: new IamAuthenticator({ apikey: watsonNLUKey }),
    version: '2018-04-05',
    serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com'
  });

const stt = new SpeechToTextV1({
    authenticator: new IamAuthenticator({ apikey: watsonSTTKey }),
    serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/05477204-4682-4db9-81ac-fb42e7b4fb11'
})

async function runSTT(basePath, params, currentData) {

    return new Promise(async (resolve, reject) => {

        const source = path.resolve(basePath, params['source'])
        const target = path.resolve(basePath, params['target'])

        logger.log(`processing ${source}`);

        const sttparams = {
            audio: fs.createReadStream(source),
            contentType: 'audio/mp3',
            model: params['model'],
            timestamps: true,
            wordConfidence: true
        };

        try {
            res = await stt.recognize(sttparams)
            .then(response => {
                logger.log('recognition done');

                const data = JSON.stringify(response.result, null, 2);
                fs.writeFileSync(target, `${data}`)

                logger.log(`result saved on ${target}`);

                resolve();
            })
            .catch(err => {
                logger.log('recognition fail');
                logger.log(err);
                reject();
            });
        } catch (err) {
            reject('error: ', err);
        }

        logger.log('stt done');

    });
}

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
            resolve();
        } catch (err) {
            reject('error: ', err);
        }
    });

}

module.exports = {
    runNLU,
    runSTT
}