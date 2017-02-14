# waple - maplestory (web) client emulator


##Planned platform support:
---
### Chrome/Chrome OS 24+ | Firefox 18+ | Safari 7.1+
### iOS 7.1+ | Android 4.4+
###### IE support is dropped because of the feature set and Maplestory works on Windows already.

##Current platform development:
---
### Chrome


### To implement for your own server and/or domain you must create: 
#### client
  - keybindings for the emulator
  - physics
  - runtime [`read js/rt.js for example`](../blob/github/js/rt.js)
  - support for Chrome OS, Android, and iOS

#### server
    general web app communication
  - browser `id` generate and refresh (every 10 minutes)
  - [SSE](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
    
    maplestory server implementation
  - account/character database
  - world environment
  - maplestory asset serving


### External
Using `ext.add({ src: classfile_in_directory })` will help you to add features without much work.

    ext = ...; // class definition
      // ext.TYPE: []
      // default types
      //  'physics'||'p', 'input'||'i', 'runtime'||'rt', 'database'||'db'

      ### Each `add()` creates a Web Worker
      // .add() @params {
      //   src: filename
      // }
      ### `remove()`
      // .remove() @params {
      //   src: filename
      // }
      ### `exec()`
      // .exec() @params {
      //   _: ext.TYPE
      //   fn: your_class_function
      //   params: []
      // }


## waple API
This will be for a planned server API. Keep watch :D
##
