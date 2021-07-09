const spawn = require('child_process').spawn
const path = require('path')


async function cut(basePath, params) {

    return new Promise((resolve, reject) => {

        const ffmpegPath = 'ffmpeg'
        const source = path.resolve(basePath, params['source'])
        const target = path.resolve(basePath, params['target'])

        let cmd = [
            '-hide_banner',
            '-loglevel', 'error',
            '-ss', params['start'],
            '-to', params['duration'],
            '-i', source
        ]

        if (params['fade_in'] > 0 || params['fade_out'] > 0) {
            cmd.push('-af');

            let fade_expression = [];
            if(params['fade_in'] > 0) {
                fade_expression.push(`afade=t=in:ss=0:d=${params['fade_in']}`);
            }
            if(params['fade_out'] > 0) {
                const fade_out_start = params['duration'] - params['start'] - params['fade_out']
                fade_expression.push(`afade=t=out:st=${fade_out_start}:d=${params['fade_out']}`)
            } 

            cmd.push(fade_expression.join(','));
        }

        cmd.push('-y')
        cmd.push(target)
        
        const ffmpeg = spawn(ffmpegPath, cmd)

        ffmpeg.stderr.pipe(process.stdout)

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

module.exports = {
    cut
}