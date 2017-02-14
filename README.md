# waple - (web) maplestory client emulator


##Planned platform support:
---
### Chrome/Chrome OS 25+ | Firefox 18+ | Safari 8+
### iOS 8+ | Android 4.4+
###### IE support is dropped because of the feature set

##Current platform development:
---
### Chrome


### To implement for your own server and/or domain you must create (a): 
#### client
  - keybindings for the emulator
  - physics system
  - asset system using HTTP GET [in `waple.net`](../blob/github/js/wne.js)
  - database read/write

#### server
    general web app communication
  - browser `id` generate and refresh (every 10 minutes)
  - update active clients of world-state
  - maplestory asset serving

    maplestory server implementation
  - account/character database
  - world environment


### External
Using `ext.add({ src: file_in_directory })` will help you to add features without much work.
Operates using [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

    ext.TYPE: []
    default types
     'action', 'assets', 'database'

    `add()`
      ext.add() @params {
        src: filename
      }
    `remove()`
      ext.remove() @params {
        src: filename
      }
    `exec()`
      ext.exec() @params {
        _: ext.TYPE
        fn: your_class_function
        params: []
      }


## waple API
This will be for a planned server API. Keep watch :D
##
