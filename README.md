# simple-task-runner
This project was intends to implement an simple flow of reusable tasks and automate the execution flow, It's a POC :).

- the application expects as a parameter the name of a file that describes a list of tasks to be performed.

for demonstration purposes, generic tasks with minimal functionality were implemented for:
- spawn the aerender process to automate video rendering.
- cut and fade audio files
- resize image files
- connect a mysql database and run a query
- extract keywords from a text
- use a ASR to convert a audio in text
- use the natural language understanding to get keywords, concepts and sentiment from a text.

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

## Jobs

### aerender
call aerender to create a movie

### audio
call ffmpeg to change a audiofile

### image 
resize, crop etc

### mysql
connect a database

### placeholder
placeholder service

### text 
process a text. 

### watson

#### Natural Language Undestanding
call the NLU service on IBM cloud

#### Speach to Text
Call a speach to text service on IBM clound

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
- mysql-promisify - https://github.com/AoiYamada/mysql-promisify
                    npm install mysql-promisify 

- keyword-extractor  https://github.com/michaeldelorenzo/keyword-extractor

- ibm-watson    https://www.npmjs.com/package/watson-developer-cloud  
                https://github.com/watson-developer-cloud/node-sdk


### Installing dependencies on mac os big sur


arch -arm64 brew install ffmpeg