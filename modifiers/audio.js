const spawn = require('child_process').spawn
const path = require('path')


function cut(basePath, params) {

    return new Promise((resolve, reject) => {

        const ffmpegPath = 'ffmpeg'
        const source = path.resolve(basePath, params['source'])
        const target = path.resolve(basePath, params['target'])

        let cmd = [
            '-ss', params['start'],
            '-t', params['duration'],
            '-i', source,
            // '-acodec', 'copy',
            '-y'
        ]

        if (params['fade_in'] > 0 || params['fade_out'] > 0) {
            cmd.push('-af');

            let fade_expression;
            if(params['fade_in'] > 0) {
                fade_expression = `afade=t=in:ss=0:d=${params['fade_in']}`
            }
            if(params['fade_out'] > 0) {
                const fade_out_start = params['duration'] - params['start'] - params['fade_out']
                fade_expression += `,afade=t=out:st=${fade_out_start}:d=${params['fade_out']}`
            }

            cmd.push(`'${fade_expression}'`);
        }

        cmd.push(target)

        const ffmpeg = spawn(ffmpegPath, cmd)

        ffmpeg.stderr.setEncoding("utf8")
        ffmpeg.stdout.on('data', (data) => {
            process.stdout.write(data);
        })

        ffmpeg.on('close', () => {
            console.log('Audio created');
            resolve();
        })
    })

}

module.exports = {
    cut
}