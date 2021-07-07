const fs = require('fs')
const path = require('path')

const rootPath = path.resolve(__dirname)
const getJobPath = param => path.resolve(rootPath, param)

const image_resize = require('./modifiers/image').resize


async function videoComposer() {

    const afterEfectsData = {
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
    job.modifiers.forEach((modifier) => {
        log(`processing modifier ${modifier.type}`)
        switch (modifier.type) {
            case 'image_resize':
                result = image_resize(jobRootFolder, modifier)
                result.then(() => {
                    log('success')
                }).catch(() => {
                    log('fail')
                })
                break
        }
        afterEfectsData.objects.push(modifier);
    })

    //export data to script
    saveAfterEfectsScript(afterEfectsData)

    //Export Video

    //Send to targets
    job.targets.forEach((target) => {
        log(`processing target ${target.type}`)
        switch (target.type) {
            case "youtube":
                break;
        }
    })


    function log(log) {
        console.log(`> ${log}`)
    }

    function loadJob(file) {
        const fileBuffer = fs.readFileSync(file, 'utf-8')
        const job = JSON.parse(fileBuffer)
        return job
    }

    function saveAfterEfectsScript(content) {
        const scriptPath = path.resolve(jobRootFolder, './output/after_efects_data.js')
        const data = JSON.stringify(content)
        return fs.writeFileSync(scriptPath, `var content = ${data}`)
    }
}

videoComposer()