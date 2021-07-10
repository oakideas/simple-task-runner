const fs = require('fs')
const path = require('path')

const rootPath = path.resolve(__dirname)
const getJobPath = param => path.resolve(rootPath, param)

const image_resize = require('./modifiers/image').resize
const audio_cut = require('./modifiers/audio').cut
const aerender = require('./modifiers/aerender')

async function videoComposer() {

    const currentData = {
        objects: []
    }

    const jobName = process.argv[2]
    log(`processing ${jobName}`)

    const jobPath = getJobPath(jobName)
    const jobRootFolder = path.dirname(jobPath)

    log(`processing ${jobPath} ${jobRootFolder}`)

    const job = loadJob(jobName)
    log(`data ${JSON.stringify(job)}`)

    let result;

    //Process modifiers
    for (let i = 0; i < job.modifiers.length; i++) {
        const modifier = job.modifiers[i];

        log(`processing modifier ${modifier.type}`)

        if(modifier.enable === false) {
            log(`task disabled ${modifier.type}`)
            continue;
        }

        switch (modifier.type) {
            case 'image_resize':
                result = await image_resize(jobRootFolder, modifier, currentData).then(() => {
                    log('success')
                }).catch((error) => {
                    log('fail ' + error)
                })
                break
            case 'audio_cut':
                result = await audio_cut(jobRootFolder, modifier, currentData).then(() => {
                    log('success')
                }).catch((error) => {
                    log('fail ' + error)
                })
                break
            case 'aerender':
                result = await aerender(jobRootFolder, modifier, currentData).then(() => {
                    log('success')
                }).catch((error) => {
                    log('fail ' + error)
                })
                break
            default:
                log(`modifier doesnt exists`);
        }
        currentData.objects.push(modifier);
    }

    // //Send to targets
    // job.targets.forEach((target) => {
    //     log(`processing target ${target.type}`)
    //     switch (target.type) {
    //         case "youtube":
    //             break;
    //     }
    // })


    function log(log) {
        console.log(`> ${log}`)
    }

    function loadJob(file) {
        const fileBuffer = fs.readFileSync(file, 'utf-8')
        const job = JSON.parse(fileBuffer)
        return job
    }
}

videoComposer()