const fs = require('fs')
const path = require('path')

const rootPath = path.resolve(__dirname)
const getJobPath = param => path.resolve(rootPath, param)

const image_resize = require('./tasks/image').resize
const audio_cut = require('./tasks/audio').cut
const aerender = require('./tasks/aerender')

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

    //Process tasks
    for (let i = 0; i < job.tasks.length; i++) {
        const task = job.tasks[i];

        log(`processing task ${task.type}`)

        if(task.enabled === false) {
            log(`task disabled ${task.type}`)
            continue;
        }

        switch (task.type) {
            case 'image_resize':
                result = await image_resize(jobRootFolder, task, currentData).then(() => {
                    log('success')
                }).catch((error) => {
                    log('fail ' + error)
                })
                break
            case 'audio_cut':
                result = await audio_cut(jobRootFolder, task, currentData).then(() => {
                    log('success')
                }).catch((error) => {
                    log('fail ' + error)
                })
                break
            case 'aerender':
                result = await aerender(jobRootFolder, task, currentData).then(() => {
                    log('success')
                }).catch((error) => {
                    log('fail ' + error)
                })
                break
            default:
                log(`task doesnt exists`);
        }
        currentData.objects.push(task);
    }

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