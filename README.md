# simple-task-runner
This project intends to implement an simple flow of reusable tasks and automate the execution flow.

- initially this project was designed to automate the flow of video creation, but writing specific tasks can be used for any purpose

At this moment I have no intention of implementing it completely, but just testing the concepts, in any case I intend to complete a minimally functional version to video processing flow as a proof of concept containing:
- ability to resize image
- ability to cut audio and add fade
- creation of a script to be used by an after effects template
- sending content to youtube

This project was inspired by this other open source project https://github.com/filipedeschamps/video-maker, it's also a proof of concept, but right now it's more complete and documented than this one :)

## Usage

node index.js job_path

ex. node index.js ./jobs/example1/job.js

## Concepts

### Job

It's a pipeline configuration

### Job.js

it's the configuration file

any individual job can be disabled using:
```
"enabled": false
```


```
{
    "tasks": [
        {
            "name": "cover",
            "type": "image_resize",
            "source": "./images/1.jpeg",
            "target": "./output/1.png",
            "width": 1920,
            "height": 1080
        },
        {
            "name": "intro",
            "type": "audio_cut",
            "source": "./audios/1.mp3",
            "target": "./output/1.mp3",
            "start": 5,
            "duration": 35,
            "fade_in": 0,
            "fade_out": 0
        },
        {
            "name": "render",
            "type": "aerender",
            "source": "./template/template.aep",
            "composition": "main",
            "data_target": "./output/data.js",
            "target": "./output/video.mov"
        },
        {
            "name": "keyword extractor",
            "type": "text_keyword_extractor",
            "text": {
                "type": "reference",
                "expression": "inputParams.sentence"
            },
            "enabled": true
        }
    ]
}
```

## examples

### example1

TODO: describe the pipeline

Credits:
Lobo Loco - Easy Walker (ID 1423).mp3 from https://freemusicarchive.org/music/Lobo_Loco/hot-summer-place/easy-walker-id-1423

### example2

Parser data using watson NLU
TODO: describe (review this job)

### example3 - ASR Demo

TODO: describe (review this job)

Credits: 
cincominutos_02_alencar_64kb.mp3 from https://librivox.org/cinco-minutos-by-jose-de-alencar/

### example4 - Mysql access

TODO: describe (review this job)

## Dependencies

- ffmpeg
- imageMagic
- mysql-promisify - npm install mysql-promisify

- keyword-extractor  https://github.com/michaeldelorenzo/keyword-extractor

- ibm-watson    https://www.npmjs.com/package/watson-developer-cloud  
                https://github.com/watson-developer-cloud/node-sdk


### Installing dependencies on mac os big sur


arch -arm64 brew install ffmpeg