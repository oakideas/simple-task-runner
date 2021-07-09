const spawn = require('child_process').spawn;
const os = require('os');
const path = require('path')

async function aerender(basePath, params) {

    return new Promise((resolve, reject) => {

        const source = path.resolve(basePath, params['source'])
        const target = path.resolve(basePath, params['target'])

        const systemPlatform = os.platform;
        let aerenderPath

        if (systemPlatform == 'darwin') {
            aerenderPath = '/Applications/Adobe After Effects CC 2019/aerender'
        } else if (systemPlatform == 'win32') {
            aerenderPath = '%programfiles%\Adobe\Adobe After Effects CC\Arquivos de suporte\aerender.exe'
        } else {
            return reject(new Error(`aerender not available in your system ${systemPlatform}`))
        }
    
        console.log('starting aerender')
    
        const aerender = spawn(aerenderPath, [
            '-comp', 'main',
            '-project', source,
            '-output', target
        ]);

        ffmpeg.stdout.on('data', (data) => {
            process.stdout.write(data)
        })
        ffmpeg.on('exit', (code) => {
            console.log('finished with '+ code)
            if(code > 0) {
                reject();
            } else {
                resolve();
            }
        })
    })

}

module.exports = aerender