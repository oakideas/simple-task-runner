# video-composer
automate video creation


## Input 

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
            "type": "audio_crop",
            "source": "./audios/1.mp3",
            "target": "./output/1.mp3",
            "start": 5,
            "end": 35,
            "fade_in": 0,
            "fade_out": 0
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
