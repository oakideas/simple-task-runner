# video-composer
This project intends to implement an audio and image processing pipeline to automate video production.

At this moment I have no intention of implementing it completely, but just testing the concepts, in any case I intend to complete a minimally functional version as a proof of concept containing:
- ability to resize image
- ability to cut audio and add fade
- creation of a script to be used by an after effects template
- sending content to youtube

This project was inspired by this other open source project https://github.com/filipedeschamps/video-maker , it's also a proof of concept, but right now it's more complete and documented than this one :)

## Usage

node index.js job_path

ex. node index.js ./jobs/example1/job.js

## Concepts

### Job

It's a pipeline configuration

### Job.js

it's the configuration file

```
{
    "modifiers": [
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
            "target": "./output/video.mov"
        }
    ],
    "targets": [
        {
            "name": "youtube",
            "type": "youtube"
        }
    ]
}
```

## examples

### example1

TODO: describe the pipeline

Credits:
Lobo Loco - Easy Walker (ID 1423).mp3 from https://freemusicarchive.org/music/Lobo_Loco/hot-summer-place/easy-walker-id-1423



## Dependencies

- ffmpeg
- imageMagic


### Installing dependencies on mac os big sur


arch -arm64 brew install ffmpeg