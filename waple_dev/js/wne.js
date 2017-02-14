//
// welcome to waple.
// ... enjoy :D
// love, archxiao

// Used for saving logs and defining if this is a debug build
//
dev = {
  on: true,
  logging: true,
  log: []
};


function newtime(vl) {
  var time = {};
  
  time.y = new Date().getUTCFullYear();
  time.m = new Date().getUTCMonth()+1;
  time.d = new Date().getUTCDate();
  time.hh = new Date().getUTCHours();
  time.mm = new Date().getUTCMinutes();
  time.ss = new Date().getUTCSeconds();
  time.ms = new Date().getUTCMilliseconds();
  
  if(vl !== undefined) {
    if(vl.h !== undefined)
      time.hh += vl.h;
    if(vl.m !== undefined) {
      if(time.mm + vl.m > 60) {
        time.hh += 1;
        time.mm += vl.m;
      }
      else {
        time.mm += vl.m;
      }
    }
  }
  
  return (time.y +"-"+ time.m +"-"+ time.d +" "+ time.hh +":"+ time.mm +":"+ time.ss +":"+ time.ms);
}

function _(log) {
  dev.log.unshift( "waple.log @ " + newtime() + " :: " + JSON.stringify(log) + "\n" );
  dev.logging ? console.log(dev.log[0]) : true;
}


(function() {
document.onreadystatechange = function() { if(document.readyState == "complete") {
 
var cfg = {
  svr: "http://" + "hnerv.com" + "/waple/",
  panel: {
    _: document.getElementById("waple_panel"),
    login: document.getElementById("waple_panel").children[0],
    background: document.getElementById("waple_panel").children[2],
    audio: document.getElementById("waple_panel").children[3]
  },
  canvas: {
    _: document.getElementById("waple_view"),
    init: function() {
      cfg.canvas.width = cfg.canvas._.width;
      cfg.canvas.height = cfg.canvas._.height;
      cfg.ctx = cfg.canvas._.getContext("2d");

      cfg.canvas.buffer = document.createElement("canvas");
      cfg.ctx.buffer = cfg.canvas.buffer.getContext("2d");
      cfg.ctx.buffer.width = cfg.canvas.width;
      cfg.ctx.buffer.height = cfg.canvas.height;

      waple.data.screen.w = cfg.canvas.width;
      waple.data.screen.h = cfg.canvas.height;
      
      _("canvas init.");_(cfg.canvas);
    },
  },
  conf: function() {
    var _ = [];
    try { _[0] = EventSource ? true : false; } catch(E) {}
    try { _[1] = Worker ? true : false; } catch(E) {}

    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
     window.webkitRequestAnimationFrame;

    try { _[2] = window.requestAnimationFrame ? true : false; } catch(E) {}

    window.indexedDB =
     window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
    window.IDBTransaction =
     window.IDBTransaction || window.webkitIDBTransaction || {READ_WRITE: "readwrite"};
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

    try { _[3] = window.indexedDB ? true : false; } catch(E) {}

    // None of these? Update your browser.
    if (!_[0] || !_[1] || !_[2] || !_[3]) {
      waple = null;
      alert("waple requires Chrome 24+, Firefox 18+, or Safari 8+\n\nplease use one of these.");
    }

    waple.data.execrt = false;
  }
};


var waple = {};


waple.fn = {};
waple.data = { keyboard: {} };
waple.net = { _: new XMLHttpRequest() };

// Creates Maplestory Object (i.e. Character, Map, Monster, Item, Meso, etc.)
// Leave `vl.obj` empty to Garbage Collect the item. (only if it has been set)
// @params {
//  type (string)  'Character' 'Map' 'Mob' 'UI'
//  name (string) programmer-defined
//  obj (object)
// }
//
waple.fn.gameobj = function(vl) {
  var _ = {
    "Character": function(vl) {},
    "UI": function(vl) {
      if(!vl) {
        waple.data.ui[vl.name].rect = null;
        waple.data.ui[vl.name].anim = null;
        waple.data.ui[vl.name] = null;

        _("Deleted " + vl.name + "-" + vl.type);
        return false;
      }

      waple.data.ui[vl.name] = {
        rect: { w: vl.rect.w, h: vl.rect.h, x: vl.rect.x, y: vl.rect.y },
        anim: { idle: vl.anim.idle, upd: vl.anim.upd, touchstart: vl.anim.ts, touchend: vl.anim.te }
      };

      _("Created " + vl.name + "-" + vl.type);
      return true;
    },
    "Mob": function(vl) {},
    "Map": function(vl) {},
  };

  _[vl.type](vl.obj);
};

// Initializes all data for running the game
//
waple.fn.data = {
  init: function() {
    function wdbase(va) {
      for(var obj in va) {

        waple.data[va[obj]] = {
          anim: {
            rect: { x:0, y:0, w:0, h:0 },
            curr: 0,
            type: { name: null, img: [] },
            max: null,
            visible: false,
            init: function() {
              // load rect{w,h},type,max from db
              //
              this.type.name = ""; // from db
              this.type.img = "waple.fn.data.imgs()";
            },
            hide: function() { this.visible = false; },
            show: function() { this.visible = true; },
            remove: function() {
              this.type.name = null;this.type.img = null;this.type = null;
              this.visible = null;
              this.rect = null;
              this.curr = null;this.max = null;

              this.init = null;
              this.hide = null;
              this.show = null;
              this.remove = null;
              this.update = null;
            },
            update: function(va) { // @param `va` Direction (string)
              if(!this.visible) { return; }
              // Update animation set from Direction. <- here
              
              this.curr++;

              if(this.curr > this.max) { this.curr = 0; }

              cfg.ctx.buffer.clearRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
              cfg.ctx.buffer.drawImage(
               this.type.img[this.curr],
               this.rect.x,
               this.rect.y,
               this.rect.w,
               this.rect.h
              );
            }
          }
        };

      }
    };

    waple.data.screen = {
      w: 0,
      h: 0,
      t: 0,
      l: 0,
    };
    
    waple.data.rt_ = [];


    wdbase(["user","chars","map","mob","ui"]);
    //waple.data.user
    // .name
    // .tex{ base,eye,mouth,hair,mask,hat,torso,pants,dress,shoes,gloves,necklace,wep,shd }
    // .anim.type{ stand,walk,jump,melee_atk,range_shot_atk,magic_atk }
    // .anim.rect{ w,h,x,y }
    // .stats{ lvl,str,int,dex,luk,fame,exp,ap,sp,mp,hp }
    // .touch{ watk,matk,wdef,mdef,spd,acc,avd }
    // .map{ z,code,next[] }
    // .inventory{ meso,equip[],use[],setup[],etc[],cash[] }
    // .buddy{}
    // .guild{}
    // .quest{ server[],official[] }

    //waple.data.chars
    // [obj].anim{ idle,walk,jump,atk }
    // [obj].rect{ w,h,x,y }
    // [obj].map{ z }

    //waple.data.map
    // .data{ code,next[] }
    // .rect{ w,h,x,y }
    // .anim{ idle,play }

    //waple.data.mob
    // [obj].anim{ idle,walk,jump,atk }
    // [obj].rect{ w,h,x,y }
    // [obj].map{ z }
    // [obj].stats{ hp,lvl,exp,mesos,kb,mp }
    // [obj].touch{ watk,matk,wdef,mdef,spd,acc,avd }

    //waple.data.ui
    // [obj].rect{ w,h,x,y }
    // [obj].anim{ idle,upd,touchstart,touchend }

    waple.data.syson = 0; 
    _("waple data init.");
  },
  cookie: function(va) {
    return va;
  },
  resource: function(vl) {
  },
  rt: function(vl) {
    if(!vl._ || waple.data.rt_.length == 0) return;

    waple.data.rt_[0]();
    waple.data.rt_.pop();
    waple.data.execrt = false;
  },
  imgs: function(va) {
    return "data:image/png;base64," + va;
  },
  b64: function(vl) {
    var _ = {
      "e": function(va) {
        return btoa( encodeURIComponent(va).replace(/%([0-9A-F]{2})/g, function(str, ch) { return String.fromCharCode('0x' + ch);}) );
      },
      "d": function(va) {
        return decodeURIComponent( Array.prototype.map.call(atob(va), function(ch) { return '%' + ('00' + ch.charCodeAt(0).toString(16)).slice(-2); }).join('') );
      }
    };

    _[vl._](vl.src);
  }
};

// waple database.
// Uses IndexedDB, read more about this. We need to implement a system to handle this.
waple.fn.db = {
  init: function() {
    try {
      var request = indexedDB.open("waple", 1);

      request.onerror = function(vl) {
        alert("please allow database access. waple will not work without it. refreshing to try again");
        window.location = "";
      };

      request.onsuccess = function(vl) {};

      request.onupgradeneeded = function(vl) {
        waple.data.db = vl.target.result;
        var _ = [];

        _[0] = waple.data.db.createObjectStore("UI", { keyPath: "file" });
        _[0].createIndex("fullpath", "fullpath", { unique: true });

        _[1] = waple.data.db.createObjectStore("Character", { keyPath: "file" });
        _[1].createIndex("fullpath", "fullpath", { unique: true });

        _[2] = waple.data.db.createObjectStore("Map", { keyPath: "file" });
        _[2].createIndex("fullpath", "fullpath", { unique: true });


      };
    } catch(E) {}

    _("waple db init.");
  },
};

// waple engine code.
// Runs the entire emulator, major code block; 
// Read this closely to understand waple.
//
waple.fn.engine = {
  init: function() {
  
    waple.engine = {
      state: 0,
      inst: [],
      _inst: {
        '-1': (function() { // close
          waple.fn.events.close();
        }),
        1: (function() {
        }),
        11: (function() {
          waple.data.ui.update();
        }),
        12: (function() { 
          waple.data.map.update();
        }),
        13: (function() {
          waple.data.user.update();
        }),
        14: (function() {
          waple.data.mob.update();
        }),
        15: (function() {
          waple.data.player.update();
        }),
        21: (function() {
          ext.exec({ _: "database", fn: "write", params: [waple.data.db, waple.data.storing] });
        }),
        22: (function() {
          ext.exec({ _: "database", fn: "read", params: [waple.data.db, waple.data.stored] });
        }),
        23: (function() {
          ext.exec({ _: "database", fn: "backup", params: [waple.data.db, waple.data.backup] });
        }),
        31: (function() {
          waple.fn.net.event("resource", { r: waple.data.res });
        }),
        32: (function() {
          waple.fn.net.event("user", { u: waple.user.acc });
        }),
        33: (function() {
          waple.fn.net.event("serverinfo", {});
        }),
        34: (function() {
          waple.fn.net.event("env", { ed: waple.data.res });
        }),
        41: (function() { // move
          _("waple input events occurring.");
          var _ = {
            38: "up",
            40: "down",
            37: "left",
            39: "right",
          };

          waple.data.user.anim.update(_[waple.data.keyboard.arrow]);
        }),
        42: (function() { // action
          _("waple input events occurring.");
        }),
        43: (function() { // click
          _("waple input events occurring.");
        }),
        44: (function() { // text/talk
          _("waple input events occurring.");
        })
      },
      
      loop: function(va) {
        waple.fn.engine.inst();
        waple.fn.engine.step();
        waple.fn.engine.draw();
        
        window.requestAnimationFrame(waple.engine.loop);
      },
    };
    
    waple.fn._ = function(va) { waple.engine.inst.unshift(va);_(waple.engine.inst); };
    
    _("waple engine init.");
    waple.engine.loop();
  },
  step: function() {
    waple.engine.state = waple.engine.inst[waple.engine.inst.length-1];
    waple.engine.inst.pop();
  },
  inst: function() {
    waple.fn.data.rt({ _: waple.data.execrt });
    try { waple.engine._inst[waple.engine.state](); } catch(E) {}
  },
  draw: function() {
    if(waple.data.syson == 0) return false;

    cfg.ctx.clearRect(0, 0, waple.data.screen.w, waple.data.screen.h);
    cfg.ctx.drawImage(cfg.canvas.buffer, 0, 0, waple.data.screen.w, waple.data.screen.h);
  },

  gamescene: function() {},
  gamescenedb: function() {}
};

// Gets user input for interacting with MapleStory
// Adds to waple.engine.inst (waple engine instructions) to process command for user input.
// Moving, clicking, actions.
//
waple.fn.events = {
  init: function() {
    cfg.canvas._.addEventListener("click", function(Ev) {
      waple.fn._(43);
      waple.data.pointer = Ev.keyCode;
    });
    
    cfg.canvas._.addEventListener("keydown", function(Ev) {
      ((Ev.keyCode == 37)||(Ev.keyCode == 38)||(Ev.keyCode == 39)||(Ev.keyCode == 40)) ? (function(key) {
        waple.fn._(41);
        waple.data.keyboard.arrow = key;
        _(waple.data.keyboard.arrow);
      })(Ev.keyCode) : false;
    });
    
    cfg.panel.login.children[1].addEventListener("keypress", function(Ev) {
      if(Ev.keyCode == 13) {
        cfg.panel.login.children[2].click();
      }
    });
    cfg.panel.login.children[2].addEventListener("click", function() {
      if(cfg.panel.login.children[1].value.length > 0) {
        if(cfg.panel.login.children[0].innerText == "Account") {
          waple.data.user.acc = cfg.panel.login.children[1].value;
          
          cfg.panel.login.children[1].value = "";
          cfg.panel.login.style.display = "none";
          (function(cb) {
            cfg.canvas._.style.display = "block";
            //waple.data.syson = 1;
            cb[0]();
          })([cfg.canvas.init]);
        }
      };

      _("waple events init.");
      _(waple.data.user);
    });
    
  },
  close: function() {}
};

// For when waple needs to be extended with other libraries.
// i.e. adding your own classes
//
External = (function() {
  function External() {
    ext = this;
    ext.init();
  };


  External.prototype = {
    init: function() {
      waple.ext = {
        TYPE: ['action','assets','database'],
        thread: [],
      };
    },
    add: function(vl) {
      waple.data.restype = "ext";
      waple.data.res = vl.src;
      waple.fn._(34);
    },
    _add: function(va) {
      ext.thread[waple.data.res] = va;
      ext.thread[waple.data.res].onmessage = function(Ev) {
        var workerdata = waple.fn.data.b64({ _:"d", src: Ev.data });
        var data = JSON.parse(workerdata);

        data.fn(data.params);
      };
    },

    remove: function(vl) {
      try { ext.thread[vl.src].terminate(); } catch(E) { _(E.message); }
    },

    exec: function(vl) {
      if(!vl._ || !vl.fn || !vl.params) {
        _("All of the parameters are needed :(");
        return;
      }

      var data = waple.fn.data.b64({ _:"e", src: { fn: vl.fn, params: vl.params } });
      var workerdata = new Uint8Array(new ArrayBuffer(data.length));

      for(var i in data.length) {
        workerdata[i] = data[i];
      }

      ext.thread[vl._].postMessage(workerdata.buffer, [workerdata.buffer]);
    }
  };

  return External;
})();

// Communicates with waple server
// Don't play with this code yet.
//
waple.fn.net = {
  netp: function() {
    if(waple.net._.readyState == 4) { if(waple.net._.status == 200) {
      if(waple.net._.responseText.length == "") {
        _("File does not exist");
        return;
      }

      switch(waple.fn.net.pass) {
        case -1:
          waple.fn.data.rt({ src: waple.net._.responseText });
        break;
        case 0:
          waple.data.currentid = waple.net._.responseText;
          var cookie = "id=" + waple.net._.responseText.split("|")[0];
          cookie += "; expires=" + new Date( newtime({m:10}) );cookie += "; path=/;";
          document.cookie = cookie;
          
          if(waple.fn.net.cb != undefined) {
            waple.fn.net.event(waple.fn.net.cb, {});
            waple.fn.net.cb = null;
          }
        break;
        
        case 1:
          if(waple.data.restype == "login") {
          }
          else if(waple.data.restype == "game") {
            objs.put({
              "type": waple.data.res,
              "img": waple.fn.data.imgs(waple.net._.responseText)
            });
          }
          else if(waple.data.restype == "ext") {
            var blob = new Blob([waple.net._.responseText], { type: "application/javascript" });
            ext._add( new Worker(URL.createObjectURL(blob)) );
          }
        break;
        case 2:
          
        break;
      }

      waple.net.wait = false;
      if(waple.net.next) {
        waple.net._.dispatchEvent(waple.fn.net.eventhandle);
        waple.net.next = false;
      }
    } }
  },
  init: function() {
    waple.fn.net.eventhandle = new Event("net");
    
    waple.net._.addEventListener("net", function(Ev) {
      waple.net._.open(waple.fn.net.req, waple.fn.net.url);
      waple.net._.send(waple.fn.net.send);

      waple.net.wait = true;
    }, false);
    
    setInterval(function() {
      waple.fn.net.event("init");
    }, 599750);

    
    _("waple net init.");
    waple.fn.net.event("init");
  },
  event: function(type, vl) {
    try { waple.fn.net.cb = vl.cb; } catch(E) {}
    
    var _ = {
      "init": function() {
        waple.fn.net.pass = 0;
        waple.fn.net.req = "GET";
        waple.fn.net.url = cfg.svr + "env?ua=" + navigator.vendor;
      },
      "env": function() {
        waple.fn.net.pass = -1;
        waple.fn.net.req = "GET";
        waple.fn.net.url = cfg.svr + "env?" + document.cookie + "|" + navigator.vendor +
         "&env=" + vl.ed;
      },
      "resource": function() {
        waple.fn.net.pass = 1;
        waple.fn.net.req = "POST";
        waple.fn.net.url = cfg.svr + "src";
        waple.fn.net.send = JSON.stringify({
         id: waple.data.currentid,
         gdp: vl.r
        });
      },
      "user": function() {
        waple.fn.net.pass = 2;
        waple.fn.net.req = "POST";
        waple.fn.net.url = cfg.svr + "src";
        waple.fn.net.send = JSON.stringify({
         id: waple.data.currentid,
         user: vl.u
        });
      },
      "serverinfo": function() {
        waple.fn.net.pass = 3;
        waple.fn.net.req = "POST";
        waple.fn.net.url = cfg.svr + "src";
        waple.fn.net.send = vl.si;
      },
    };
    
    waple.net._.onreadystatechange = waple.fn.net.netp;
    
    _[type]();
    if(waple.net.wait != true) waple.net._.dispatchEvent(waple.fn.net.eventhandle);
    else { waple.net.next = true; }
  },
};

// Starts playing waple sounds by name.
// This allows for multiple sounds to be loaded during the game
// and keep them in memory.
// Don't worry about stopping sounds, html5 does it automatically.
// We also won't worry about removing them. The user might go back there.
//
waple.sound = function(vl) {
  waple.data.audio[vl.name] = new Audio();
  
  waple.data.audio[vl.name].src = vl.d;waple.data.audio[vl.name].autoplay = true;
};


cfg.conf();

if(waple != null) {
  (function(cb) {
    waple.fn.events.init();
    waple.fn.data.init();
    waple.fn.db.init();
    waple.fn.engine.init();

    cb();
  })( waple.fn.net.init );

  new External();
  waple.data.execrt = true;
  waple.data.rt_[0] = (function() { ext.add({ src: "assets" }); });
}

document.onreadystatechange = null;

  
}};
})();
