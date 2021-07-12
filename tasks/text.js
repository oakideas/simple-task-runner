const keyword_extractor = require("keyword-extractor");
const logger = require('../util/Logger')


async function keywordExtractor(basePath, params, currentData) {

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

        logger.log('>> extracting keywords from sentence: ' + sentence);

        const extraction_result =
        keyword_extractor.extract(sentence, params.options);

        logger.log(extraction_result);

        params.task_output = {
            'keywords': extraction_result
        }
        
        resolve()

    })

}

module.exports = {
    keywordExtractor
}