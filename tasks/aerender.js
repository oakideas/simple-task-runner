const fs = require('fs')
const spawn = require('child_process').spawn;
const os = require('os');
const path = require('path')

const logger = require('../util/Logger')

async function aerender(basePath, params, currentData) {

    return new Promise((resolve, reject) => {

        const source = path.resolve(basePath, params['source'])
        const target = path.resolve(basePath, params['target'])
        const data_target = path.resolve(basePath, params['data_target'])

        params.task_output = {
            'target': target,
            'data_target': data_target
        }

        composition = 'main'
        if (params['composition']) {
            composition = params['composition']
        }

        createScript(data_target, currentData);

        const systemPlatform = os.platform;
        let aerenderPath

        if (systemPlatform == 'darwin') {
            aerenderPath = '/Applications/Adobe After Effects 2021/aerender'
        } else if (systemPlatform == 'win32') {
            aerenderPath = '%programfiles%\Adobe\Adobe After Effects CC\Arquivos de suporte\aerender.exe'
        } else {
            return reject(new Error(`aerender not available in your system ${systemPlatform}`))
        }
    
        logger.log(`starting aerender ${source}`)

        if (fs.existsSync(target)) {
            fs.unlinkSync(target)
        }
    
        const aerender = spawn(aerenderPath, [
            '-comp', composition,
            '-project', source,
            '-output', target
        ])

        aerender.stdout.on('data', (data) => {
            process.stdout.write(data)
        })

        aerender.on('exit', (code) => {
            logger.log('finished with '+ code)
            if(code > 0) {
                reject()
            } else {
                resolve()
            }
        })

        aerender.on('error', (err) => {
            logger.log(err)
            reject()
        })

    })

    function createScript(outputPath, currentData) {
        const data = JSON.stringify(currentData)
        return fs.writeFileSync(outputPath, `var data = ${data}`)
    }

}

module.exports = aerender