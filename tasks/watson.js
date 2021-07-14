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
    serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com'
})

async function runSTT(basePath, params, currentData) {

    return new Promise(async (resolve, reject) => {

        const source = path.resolve(basePath, params['source'])
        const target = path.resolve(basePath, params['target'])

        // const params = {
        //     audio: fs.createReadStream('./resources/speech.wav'),
        //     contentType: 'audio/l16; rate=44100'
        // };
        // stt.recognize(params)
        // .then(response => {
        //     console.log(JSON.stringify(response.result, null, 2));
        // })
        // .catch(err => {
        //     console.log(err);
        // });

        // fs.createReadStream('./resources/speech.wav')
        // .pipe(stt.recognizeUsingWebSocket({ contentType: 'audio/l16; rate=44100' }))
        // .pipe(fs.createWriteStream('./transcription.txt'));

        const getModelParams = {
            modelId: params['modelId'],
        };

        const sttparams = {
            audio: fs.createReadStream(source),
            contentType: 'audio/mp3'
        };

        stt.getModel(getModelParams);

        stt.recognize(sttparams)
        .then(response => {
            logger.log(JSON.stringify(response.result, null, 2));
            resolve();
        })
        .catch(err => {
            logger.log(err);
            reject();
        });

        // fs.createReadStream(source)
        // .pipe(stt.recognizeUsingWebSocket({ contentType: 'audio/mp3' }))
        // .pipe(fs.createWriteStream(target));

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

            resolve()
        } catch (err) {
            reject('error: ', err);
        }
    });

}

module.exports = {
    runNLU,
    runSTT
}