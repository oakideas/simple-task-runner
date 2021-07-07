const fs = require('fs')
const path = require('path')

const rootPath = path.resolve(__dirname)
const getJobPath = param => path.resolve(rootPath, param)

const image_resize = require('./modifiers/image').resize


async function videoComposer() {

    const jobName = process.argv[2]
    log(`processing ${jobName}`)

    const jobPath = getJobPath(jobName)
    const jobRootFolder = path.dirname(jobPath)

    log(`processing ${jobPath} ${jobRootFolder}`)

    const job = loadJob(jobName)
    log(`data ${JSON.stringify(job)}`)

    //Process modifiers
    job.modifiers.forEach((modifier) => {
        log(`processing modifier ${modifier.type}`)
        switch (modifier.type) {
            case 'image_resize':
                image_resize(jobRootFolder, modifier)
                break
        }
    })
    //Export Video
    //Send to targets


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