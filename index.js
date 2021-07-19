const fs = require('fs')
const path = require('path')

const rootPath = path.resolve(__dirname)
const getJobPath = param => path.resolve(rootPath, param)

const image_resize = require('./tasks/image').resize
const audio_cut = require('./tasks/audio').cut
const aerender = require('./tasks/aerender')

const watson_nlu = require('./tasks/watson').runNLU
const watson_stt = require('./tasks/watson').runSTT

const text_keyword_extractor = require('./tasks/text').keywordExtractor

const logger = require('./util/Logger')

async function RunTasks() {

    const currentData = {
        inputParams: {},
        objects: []
    }

    const jobName = process.argv[2]
    logger.log(`processing ${jobName}`)

    const inputParamsPath = process.argv[3]
    if (inputParamsPath) {
        currentData.inputParams = loadInputParams(inputParamsPath)
    }

    const jobPath = getJobPath(jobName)
    const jobRootFolder = path.dirname(jobPath)

    logger.log(`processing ${jobPath} ${jobRootFolder}`)

    const job = loadJob(jobName)
    logger.log(`data ${JSON.stringify(job)}`)
    logger.log(`data ${JSON.stringify(currentData)}`)

    let result;

    //Process tasks
    for (let i = 0; i < job.tasks.length; i++) {
        const task = job.tasks[i];

        logger.log(`processing task ${task.type}`)

        if(task.enabled === false) {
            logger.log(`task disabled ${task.type}`)
            continue;
        }

        switch (task.type) {
            case 'image_resize':
                result = await image_resize(jobRootFolder, task, currentData).then(() => {
                    logger.log('success')
                }).catch((error) => {
                    logger.log('fail ' + error)
                })
                break
            case 'audio_cut':
                result = await audio_cut(jobRootFolder, task, currentData).then(() => {
                    logger.log('success')
                }).catch((error) => {
                    logger.log('fail ' + error)
                })
                break
            case 'aerender':
                result = await aerender(jobRootFolder, task, currentData).then(() => {
                    logger.log('success')
                }).catch((error) => {
                    logger.log('fail ' + error)
                })
                break
            case 'watson_nlu':
                result = await watson_nlu(jobRootFolder, task, currentData).then(() => {
                    logger.log('success')
                }).catch((error) => {
                    logger.log('fail ' + error)
                })
                break
            case 'watson_stt':
                result = await watson_stt(jobRootFolder, task, currentData).then(() => {
                    logger.log('success')
                }).catch((error) => {
                    logger.log('fail ' + error)
                })
                break
            case 'text_keyword_extractor':
                result = await text_keyword_extractor(jobRootFolder, task, currentData).then(() => {
                    logger.log('success')
                }).catch((error) => {
                    logger.log('fail ' + error)
                })
                break
            default:
                logger.log(`task type does not exists ${task.type}`);
        }
        currentData.objects.push(task);
    }

    function loadJob(file) {
        const fileBuffer = fs.readFileSync(file, 'utf-8')
        const job = JSON.parse(fileBuffer)
        return job
    }

    function loadInputParams(inputFile) {
        const fileBuffer = fs.readFileSync(inputFile, 'utf-8');
        const inputParams = JSON.parse(fileBuffer);
        return inputParams;
    }
}

RunTasks()