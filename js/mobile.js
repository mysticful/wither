// dynamic library for mobile controls, script from sealiee.

(function() {
  'use strict';

  if (typeof window === 'undefined') return;

  var TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  var MOBILE = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!TOUCH && !MOBILE) return;

  var PREFIX = 'mgp_';
  var VERSION = '1.1.0';

  function store(key, val) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch(e) {}
  }

  function load(key, fallback) {
    try {
      var v = localStorage.getItem(PREFIX + key);
      return v !== null ? JSON.parse(v) : fallback;
    } catch(e) { return fallback; }
  }

  var MOVEMENT_SCHEMES = {
    arrows: {
      label: 'Arrows',
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight'
    },
    wasd: {
      label: 'WASD',
      up: 'KeyW',
      down: 'KeyS',
      left: 'KeyA',
      right: 'KeyD'
    },
    zqsd: {
      label: 'ZQSD',
      up: 'KeyZ',
      down: 'KeyS',
      left: 'KeyQ',
      right: 'KeyD'
    },
    ijkl: {
      label: 'IJKL',
      up: 'KeyI',
      down: 'KeyK',
      left: 'KeyJ',
      right: 'KeyL'
    },
    custom: {
      label: 'Custom',
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight'
    }
  };

  var defaults = {
    inputMode: 'joystick',
    joystickType: 'fixed',
    directionMode: '4way',
    movementScheme: 'arrows',
    customMoveUp: 'ArrowUp',
    customMoveDown: 'ArrowDown',
    customMoveLeft: 'ArrowLeft',
    customMoveRight: 'ArrowRight',
    actionButtons: true,
    actionBindA: 'Space',
    actionBindB: 'KeyX',
    actionBindX: 'ShiftLeft',
    actionBindY: 'KeyZ',
    cursorMode: false,
    doubleTapDrag: false,
    virtualKeyboard: false,
    hapticFeedback: true,
    opacity: 0.45,
    controlSize: 1.0,
    showControls: true
  };

  var state = {};
  Object.keys(defaults).forEach(function(k) {
    state[k] = load(k, defaults[k]);
  });

  function saveState() {
    Object.keys(state).forEach(function(k) { store(k, state[k]); });
  }

  function getMovementKeys() {
    if (state.movementScheme === 'custom') {
      return {
        up: state.customMoveUp,
        down: state.customMoveDown,
        left: state.customMoveLeft,
        right: state.customMoveRight
      };
    }
    var scheme = MOVEMENT_SCHEMES[state.movementScheme];
    if (!scheme) scheme = MOVEMENT_SCHEMES.arrows;
    return {
      up: scheme.up,
      down: scheme.down,
      left: scheme.left,
      right: scheme.right
    };
  }

  var KEY_DB = {
    ArrowUp:    { key: 'ArrowUp',    code: 'ArrowUp',    keyCode: 38 },
    ArrowDown:  { key: 'ArrowDown',  code: 'ArrowDown',  keyCode: 40 },
    ArrowLeft:  { key: 'ArrowLeft',  code: 'ArrowLeft',  keyCode: 37 },
    ArrowRight: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
    Space:      { key: ' ',          code: 'Space',       keyCode: 32 },
    Enter:      { key: 'Enter',      code: 'Enter',       keyCode: 13 },
    ShiftLeft:  { key: 'Shift',      code: 'ShiftLeft',   keyCode: 16 },
    ShiftRight: { key: 'Shift',      code: 'ShiftRight',  keyCode: 16 },
    ControlLeft:{ key: 'Control',    code: 'ControlLeft',keyCode: 17 },
    KeyZ:       { key: 'z',          code: 'KeyZ',        keyCode: 90 },
    KeyX:       { key: 'x',          code: 'KeyX',        keyCode: 88 },
    KeyC:       { key: 'c',          code: 'KeyC',        keyCode: 67 },
    KeyA:       { key: 'a',          code: 'KeyA',        keyCode: 65 },
    KeyS:       { key: 's',          code: 'KeyS',        keyCode: 83 },
    KeyD:       { key: 'd',          code: 'KeyD',        keyCode: 68 },
    KeyW:       { key: 'w',          code: 'KeyW',        keyCode: 87 },
    KeyE:       { key: 'e',          code: 'KeyE',        keyCode: 69 },
    KeyQ:       { key: 'q',          code: 'KeyQ',        keyCode: 81 },
    KeyR:       { key: 'r',          code: 'KeyR',        keyCode: 82 },
    KeyF:       { key: 'f',          code: 'KeyF',        keyCode: 70 },
    KeyI:       { key: 'i',          code: 'KeyI',        keyCode: 73 },
    KeyJ:       { key: 'j',          code: 'KeyJ',        keyCode: 74 },
    KeyK:       { key: 'k',          code: 'KeyK',        keyCode: 75 },
    KeyL:       { key: 'l',          code: 'KeyL',        keyCode: 76 },
    Digit1:     { key: '1',          code: 'Digit1',      keyCode: 49 },
    Digit2:     { key: '2',          code: 'Digit2',      keyCode: 50 },
    Digit3:     { key: '3',          code: 'Digit3',      keyCode: 51 },
    Digit4:     { key: '4',          code: 'Digit4',      keyCode: 52 },
    Digit5:     { key: '5',          code: 'Digit5',      keyCode: 53 },
    Tab:        { key: 'Tab',        code: 'Tab',         keyCode: 9  },
    Escape:     { key: 'Escape',     code: 'Escape',      keyCode: 27 },
    Backspace:  { key: 'Backspace',  code: 'Backspace',   keyCode: 8  }
  };

  var BINDABLE_KEYS = [
    'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
    'Space','Enter','ShiftLeft','ControlLeft','KeyZ','KeyX','KeyC',
    'KeyA','KeyS','KeyD','KeyW','KeyE','KeyQ','KeyR','KeyF',
    'KeyI','KeyJ','KeyK','KeyL',
    'Digit1','Digit2','Digit3','Digit4','Digit5',
    'Tab','Escape','Backspace'
  ];

  function keyLabel(code) {
    if (!code) return '?';
    var map = {
      Space:'SPC',Enter:'ENT',ShiftLeft:'SHF',ShiftRight:'SHF',
      ControlLeft:'CTL',Tab:'TAB',Escape:'ESC',Backspace:'BKS',
      ArrowUp:'\u2191',ArrowDown:'\u2193',ArrowLeft:'\u2190',ArrowRight:'\u2192'
    };
    if (map[code]) return map[code];
    return code.replace('Key','').replace('Digit','');
  }

  var pressedKeys = {};

  function fireKey(code, type) {
    if (!KEY_DB[code]) return;
    if (type === 'keydown' && pressedKeys[code]) return;
    if (type === 'keyup' && !pressedKeys[code]) return;
    if (type === 'keydown') pressedKeys[code] = true;
    if (type === 'keyup') delete pressedKeys[code];
    var info = KEY_DB[code];
    var props = {
      key: info.key,
      code: info.code,
      keyCode: info.keyCode,
      which: info.keyCode,
      bubbles: true,
      cancelable: true
    };
    var evt = new KeyboardEvent(type, props);
    document.dispatchEvent(evt);
    if (document.activeElement && document.activeElement !== document.body) {
      try { document.activeElement.dispatchEvent(new KeyboardEvent(type, props)); } catch(e) {}
    }
    var canvas = document.querySelector('canvas');
    if (canvas) {
      try { canvas.dispatchEvent(new KeyboardEvent(type, props)); } catch(e) {}
    }
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      try {
        var iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
        iframeDoc.dispatchEvent(new KeyboardEvent(type, props));
        var iframeCanvas = iframeDoc.querySelector('canvas');
        if (iframeCanvas) iframeCanvas.dispatchEvent(new KeyboardEvent(type, props));
      } catch(e) {}
    }
    if (window.MobileGamepad && window.MobileGamepad.emit) {
      window.MobileGamepad.emit(type, { code: code, key: info.key });
    }
  }

  function releaseAllKeys() {
    Object.keys(pressedKeys).forEach(function(code) { fireKey(code, 'keyup'); });
  }

  function haptic(ms) {
    if (!state.hapticFeedback) return;
    if (navigator.vibrate) navigator.vibrate(ms || 10);
  }

  function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
  function dist(x1, y1, x2, y2) { return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)); }

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  var CSS = [
    '.mgp-overlay{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2147483647;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none;overflow:hidden}',
    '.mgp-ctrl{pointer-events:auto;touch-action:none;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;user-select:none;-webkit-user-select:none;position:relative;z-index:2147483646}',
    '.mgp-joystick-zone{position:absolute;bottom:12px;left:12px;transition:opacity 0.2s;z-index:2147483647}',
    '.mgp-joystick-base{width:130px;height:130px;border-radius:50%;background:radial-gradient(circle at 40% 35%,rgba(255,255,255,0.12),rgba(255,255,255,0.04));border:1.5px solid rgba(255,255,255,0.18);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);position:relative;box-shadow:0 2px 16px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.08);transition:transform 0.15s,box-shadow 0.15s}',
    '.mgp-joystick-base.mgp-active{box-shadow:0 2px 24px rgba(100,180,255,0.15),inset 0 1px 0 rgba(255,255,255,0.12);border-color:rgba(100,180,255,0.3)}',
    '.mgp-joystick-knob{width:52px;height:52px;border-radius:50%;background:radial-gradient(circle at 40% 35%,rgba(255,255,255,0.28),rgba(255,255,255,0.1));border:1.5px solid rgba(255,255,255,0.25);position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);box-shadow:0 2px 10px rgba(0,0,0,0.25);transition:box-shadow 0.1s;will-change:left,top}',
    '.mgp-joystick-knob.mgp-active{background:radial-gradient(circle at 40% 35%,rgba(255,255,255,0.4),rgba(255,255,255,0.15));box-shadow:0 2px 14px rgba(100,180,255,0.2);border-color:rgba(100,180,255,0.4)}',
    '.mgp-joystick-dir{position:absolute;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.08);transition:background 0.15s,transform 0.15s}',
    '.mgp-joystick-dir.mgp-lit{background:rgba(100,180,255,0.5);transform:scale(1.3)}',
    '.mgp-joystick-dir.mgp-dir-up{top:8px;left:50%;margin-left:-4px}',
    '.mgp-joystick-dir.mgp-dir-down{bottom:8px;left:50%;margin-left:-4px}',
    '.mgp-joystick-dir.mgp-dir-left{left:8px;top:50%;margin-top:-4px}',
    '.mgp-joystick-dir.mgp-dir-right{right:8px;top:50%;margin-top:-4px}',
    '.mgp-float-base{position:absolute;pointer-events:none;opacity:0;transition:opacity 0.12s}',
    '.mgp-float-base.mgp-visible{opacity:1}',
    '.mgp-dpad-zone{position:absolute;bottom:12px;left:12px;transition:opacity 0.2s;z-index:2147483647}',
    '.mgp-dpad{width:130px;height:130px;position:relative}',
    '.mgp-dpad-btn{position:absolute;width:42px;height:42px;border-radius:10px;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;transition:background 0.1s,border-color 0.1s,transform 0.08s;box-shadow:0 1px 8px rgba(0,0,0,0.15)}',
    '.mgp-dpad-btn.mgp-pressed{background:rgba(100,180,255,0.2);border-color:rgba(100,180,255,0.4);transform:scale(0.92)}',
    '.mgp-dpad-btn svg{width:18px;height:18px;fill:none;stroke:rgba(255,255,255,0.55);stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round}',
    '.mgp-dpad-btn.mgp-pressed svg{stroke:rgba(100,180,255,0.8)}',
    '.mgp-dpad-up{top:0;left:50%;margin-left:-21px}',
    '.mgp-dpad-down{bottom:0;left:50%;margin-left:-21px}',
    '.mgp-dpad-left{left:0;top:50%;margin-top:-21px}',
    '.mgp-dpad-right{right:0;top:50%;margin-top:-21px}',
    '.mgp-dpad-center{position:absolute;top:50%;left:50%;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08)}',
    '.mgp-actions{position:absolute;bottom:16px;right:16px;width:120px;height:120px;transition:opacity 0.2s;z-index:2147483647}',
    '.mgp-action-btn{position:absolute;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.15);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:rgba(255,255,255,0.55);letter-spacing:0.5px;transition:background 0.1s,border-color 0.1s,transform 0.08s,color 0.1s;box-shadow:0 1px 8px rgba(0,0,0,0.15);text-transform:uppercase}',
    '.mgp-action-btn.mgp-pressed{background:rgba(100,180,255,0.2);border-color:rgba(100,180,255,0.4);color:rgba(100,180,255,0.9);transform:scale(0.9)}',
    '.mgp-action-a{bottom:0;left:50%;margin-left:-22px}',
    '.mgp-action-b{right:0;top:50%;margin-top:-22px}',
    '.mgp-action-x{left:0;top:50%;margin-top:-22px}',
    '.mgp-action-y{top:0;left:50%;margin-left:-22px}',
    '.mgp-switch-btn{position:absolute;bottom:150px;left:16px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;box-shadow:0 1px 6px rgba(0,0,0,0.12);transition:background 0.15s,border-color 0.15s;z-index:2147483647}',
    '.mgp-switch-btn:active{background:rgba(100,180,255,0.15);border-color:rgba(100,180,255,0.3)}',
    '.mgp-switch-btn svg{width:16px;height:16px;fill:none;stroke:rgba(255,255,255,0.45);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.mgp-gear{position:absolute;bottom:148px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;box-shadow:0 1px 6px rgba(0,0,0,0.12);transition:background 0.2s,transform 0.3s,border-color 0.2s;z-index:2147483647}',
    '.mgp-gear.mgp-open{background:rgba(100,180,255,0.12);border-color:rgba(100,180,255,0.3);transform:rotate(45deg)}',
    '.mgp-gear svg{width:16px;height:16px;fill:none;stroke:rgba(255,255,255,0.45);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '.mgp-panel-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);opacity:0;pointer-events:none;transition:opacity 0.25s;z-index:2147483647}',
    '.mgp-panel-backdrop.mgp-visible{opacity:1;pointer-events:auto}',
    '.mgp-panel{position:fixed;bottom:0;left:0;right:0;max-height:85vh;background:rgba(20,22,28,0.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.1);border-radius:20px 20px 0 0;transform:translateY(100%);transition:transform 0.3s cubic-bezier(0.32,0.72,0,1);z-index:2147483647;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 0 env(safe-area-inset-bottom,24px) 0;touch-action:pan-y}',
    '.mgp-panel.mgp-visible{transform:translateY(0)}',
    '.mgp-panel-handle{width:36px;height:4px;border-radius:2px;background:rgba(255,255,255,0.2);margin:10px auto 0}',
    '.mgp-panel-title{font-size:17px;font-weight:700;color:rgba(255,255,255,0.9);padding:18px 20px 10px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;letter-spacing:-0.2px}',
    '.mgp-section{padding:6px 20px 14px}',
    '.mgp-section-label{font-size:11px;font-weight:700;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:1.2px;padding:14px 0 8px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '.mgp-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;padding:14px 0;min-height:52px;border-bottom:1px solid rgba(255,255,255,0.05);gap:8px}',
    '.mgp-row:last-child{border-bottom:none}',
    '.mgp-row-label{font-size:14px;color:rgba(255,255,255,0.75);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-weight:500;flex-shrink:0}',
    '.mgp-toggle{position:relative;width:54px;height:32px;border-radius:16px;background:rgba(255,255,255,0.12);border:none;padding:0;cursor:pointer;transition:background 0.2s;flex-shrink:0;touch-action:manipulation;-webkit-tap-highlight-color:rgba(100,180,255,0.15)}',
    '.mgp-toggle.mgp-on{background:rgba(52,120,246,0.85)}',
    '.mgp-toggle-thumb{position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.25);transition:left 0.2s}',
    '.mgp-toggle.mgp-on .mgp-toggle-thumb{left:25px}',
    '.mgp-seg{display:flex;background:rgba(255,255,255,0.06);border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);width:100%}',
    '.mgp-seg-btn{flex:1;padding:14px 10px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.45);text-align:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:transparent;border:none;cursor:pointer;transition:background 0.15s,color 0.15s;letter-spacing:0.3px;touch-action:manipulation;min-height:48px;-webkit-tap-highlight-color:rgba(100,180,255,0.15)}',
    '.mgp-seg-btn.mgp-active{background:rgba(52,120,246,0.75);color:rgba(255,255,255,0.95)}',
    '.mgp-slider-wrap{display:flex;align-items:center;gap:10px;flex:1;max-width:160px}',
    '.mgp-slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:2px;background:rgba(255,255,255,0.12);outline:none}',
    '.mgp-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer}',
    '.mgp-slider-val{font-size:11px;color:rgba(255,255,255,0.45);min-width:28px;text-align:right;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-variant-numeric:tabular-nums}',
    '.mgp-bind-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)}',
    '.mgp-bind-row:last-child{border-bottom:none}',
    '.mgp-bind-label{font-size:14px;color:rgba(255,255,255,0.5);width:28px;font-weight:700;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '.mgp-bind-label.mgp-bind-label-wide{width:50px}',
    '.mgp-bind-btn{flex:1;padding:12px 14px;min-height:44px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);font-size:14px;font-weight:600;text-align:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;transition:background 0.15s,border-color 0.15s;touch-action:manipulation;-webkit-tap-highlight-color:rgba(100,180,255,0.15)}',
    '.mgp-bind-btn:active{background:rgba(52,120,246,0.15);border-color:rgba(52,120,246,0.3)}',
    '.mgp-cursor-dot{position:fixed;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:2px solid rgba(255,255,255,0.6);background:rgba(255,255,255,0.08);pointer-events:none;z-index:2147483644;transition:opacity 0.15s;box-shadow:0 0 8px rgba(0,0,0,0.3)}',
    '.mgp-cursor-dot.mgp-dragging{background:rgba(100,180,255,0.2);border-color:rgba(100,180,255,0.7)}',
    '.mgp-kbd-btn{position:absolute;bottom:70px;right:16px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;box-shadow:0 1px 6px rgba(0,0,0,0.12);transition:background 0.15s,border-color 0.15s;z-index:2147483647}',
    '.mgp-kbd-btn:active{background:rgba(100,180,255,0.15);border-color:rgba(100,180,255,0.3)}',
    '.mgp-kbd-btn svg{width:16px;height:16px;fill:none;stroke:rgba(255,255,255,0.45);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '.mgp-hidden-input{position:fixed;top:-100px;left:-100px;opacity:0;width:1px;height:1px;border:none;outline:none;pointer-events:none}',
    '.mgp-version{position:absolute;top:8px;right:12px;font-size:9px;color:rgba(255,255,255,0.15);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;pointer-events:none}',
    '@keyframes mgp-fadein{from{opacity:0}to{opacity:1}}',
    '.mgp-overlay{animation:mgp-fadein 0.3s ease}',
    '@supports(padding:env(safe-area-inset-bottom)){.mgp-joystick-zone{bottom:calc(12px + env(safe-area-inset-bottom))}.mgp-dpad-zone{bottom:calc(12px + env(safe-area-inset-bottom))}.mgp-actions{bottom:calc(16px + env(safe-area-inset-bottom))}}',
    '@media(orientation:landscape){.mgp-joystick-zone{bottom:8px;left:8px}.mgp-dpad-zone{bottom:8px;left:8px}.mgp-actions{bottom:12px;right:12px}}',
    '.mgp-reset-btn{display:block;width:100%;padding:16px;min-height:48px;margin-top:8px;border-radius:10px;background:rgba(255,60,60,0.12);border:1px solid rgba(255,60,60,0.2);color:rgba(255,100,100,0.85);font-size:13px;font-weight:600;text-align:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;cursor:pointer;transition:background 0.15s;touch-action:manipulation}',
    '.mgp-reset-btn:active{background:rgba(255,60,60,0.25)}',
    '.mgp-divider{height:1px;background:rgba(255,255,255,0.06);margin:8px 0}',
    '.mgp-scheme-hint{font-size:11px;color:rgba(255,255,255,0.3);padding:4px 0 0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}'
  ].join('\n');

  function injectCSS() {
    var existing = document.getElementById('mgp-styles');
    if (existing) existing.parentNode.removeChild(existing);
    var s = document.createElement('style');
    s.id = 'mgp-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  var ICONS = {
    gear: '<svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
    swap: '<svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="14" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>',
    arrowDown: '<svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>',
    arrowLeft: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>'
  };

  function Joystick(overlay, onUpdate) {
    this.overlay = overlay;
    this.onUpdate = onUpdate;
    this.active = false;
    this.touchId = null;
    this.cx = 0;
    this.cy = 0;
    this.knobX = 0;
    this.knobY = 0;
    this.dirs = { up: false, down: false, left: false, right: false };
    this.zone = null;
    this.base = null;
    this.knob = null;
    this.dirDots = {};
    this.floatZone = null;
    this.floatBase = null;
    this.floatKnob = null;
    this.floatDirDots = {};
    this.radius = 0;
    this.deadzone = 0.18;
    this.buildFixed();
    this.buildFloat();
    this.bindEvents();
  }

  Joystick.prototype.buildFixed = function() {
    this.zone = el('div', 'mgp-joystick-zone mgp-ctrl', this.overlay);
    this.base = el('div', 'mgp-joystick-base', this.zone);
    var dirs = ['up','down','left','right'];
    for (var i = 0; i < dirs.length; i++) {
      this.dirDots[dirs[i]] = el('div', 'mgp-joystick-dir mgp-dir-' + dirs[i], this.base);
    }
    this.knob = el('div', 'mgp-joystick-knob', this.base);
  };

  Joystick.prototype.buildFloat = function() {
    this.floatZone = el('div', 'mgp-ctrl', this.overlay);
    this.floatZone.style.cssText = 'position:absolute;top:0;left:0;width:50%;height:100%;pointer-events:auto;touch-action:none;display:none;z-index:2147483647';
    this.floatBase = el('div', 'mgp-joystick-base mgp-float-base', this.floatZone);
    var dirs = ['up','down','left','right'];
    for (var i = 0; i < dirs.length; i++) {
      this.floatDirDots[dirs[i]] = el('div', 'mgp-joystick-dir mgp-dir-' + dirs[i], this.floatBase);
    }
    this.floatKnob = el('div', 'mgp-joystick-knob', this.floatBase);
  };

  Joystick.prototype.getActiveBase = function() {
    return state.joystickType === 'floating' ? this.floatBase : this.base;
  };

  Joystick.prototype.getActiveKnob = function() {
    return state.joystickType === 'floating' ? this.floatKnob : this.knob;
  };

  Joystick.prototype.getActiveDots = function() {
    return state.joystickType === 'floating' ? this.floatDirDots : this.dirDots;
  };

  Joystick.prototype.updateVisibility = function() {
    var isJoystick = state.inputMode === 'joystick' && state.showControls;
    var isFloat = state.joystickType === 'floating';
    this.zone.style.display = (isJoystick && !isFloat) ? '' : 'none';
    this.floatZone.style.display = (isJoystick && isFloat) ? '' : 'none';
  };

  Joystick.prototype.applyScale = function() {
    var s = state.controlSize;
    this.zone.style.transform = 'scale(' + s + ')';
    this.zone.style.transformOrigin = 'bottom left';
  };

  Joystick.prototype.bindEvents = function() {
    var self = this;

    this.zone.addEventListener('touchstart', function(e) {
      if (state.joystickType !== 'fixed' || state.inputMode !== 'joystick') return;
      e.preventDefault();
      e.stopPropagation();
      var t = e.changedTouches[0];
      self.touchId = t.identifier;
      var rect = self.base.getBoundingClientRect();
      self.cx = rect.left + rect.width / 2;
      self.cy = rect.top + rect.height / 2;
      self.radius = rect.width / 2;
      self.active = true;
      self.base.classList.add('mgp-active');
      self.knob.classList.add('mgp-active');
      self.handleMove(t.clientX, t.clientY);
      haptic(8);
    }, { passive: false, capture: true });

    this.floatZone.addEventListener('touchstart', function(e) {
      if (state.joystickType !== 'floating' || state.inputMode !== 'joystick') return;
      if (self.active) return;
      e.preventDefault();
      e.stopPropagation();
      var t = e.changedTouches[0];
      self.touchId = t.identifier;
      var baseSize = 130 * state.controlSize;
      var bx = clamp(t.clientX, baseSize / 2 + 8, window.innerWidth * 0.5 - baseSize / 2);
      var by = clamp(t.clientY, baseSize / 2 + 8, window.innerHeight - baseSize / 2 - 8);
      self.cx = bx;
      self.cy = by;
      self.radius = baseSize / 2;
      self.floatBase.style.width = baseSize + 'px';
      self.floatBase.style.height = baseSize + 'px';
      self.floatBase.style.left = (bx - baseSize / 2) + 'px';
      self.floatBase.style.top = (by - baseSize / 2) + 'px';
      self.floatBase.classList.add('mgp-visible', 'mgp-active');
      self.floatKnob.classList.add('mgp-active');
      self.floatKnob.style.width = (52 * state.controlSize) + 'px';
      self.floatKnob.style.height = (52 * state.controlSize) + 'px';
      self.active = true;
      self.handleMove(t.clientX, t.clientY);
      haptic(8);
    }, { passive: false, capture: true });

    document.addEventListener('touchmove', function(e) {
      if (!self.active || self.touchId === null) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === self.touchId) {
          e.preventDefault();
          self.handleMove(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
          break;
        }
      }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
      if (!self.active || self.touchId === null) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === self.touchId) {
          self.release();
          break;
        }
      }
    }, { passive: false });

    document.addEventListener('touchcancel', function(e) {
      if (!self.active || self.touchId === null) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === self.touchId) {
          self.release();
          break;
        }
      }
    }, { passive: false });
  };

  Joystick.prototype.handleMove = function(x, y) {
    var dx = x - this.cx;
    var dy = y - this.cy;
    var d = dist(0, 0, dx, dy);
    var maxR = this.radius - 26 * state.controlSize;
    if (maxR < 10) maxR = 10;

    if (d > maxR) {
      dx = dx / d * maxR;
      dy = dy / d * maxR;
    }

    var activeKnob = this.getActiveKnob();
    activeKnob.style.left = 'calc(50% + ' + dx + 'px)';
    activeKnob.style.top = 'calc(50% + ' + dy + 'px)';

    var norm = d / maxR;
    var newDirs = { up: false, down: false, left: false, right: false };
    var moveKeys = getMovementKeys();

    if (norm > this.deadzone) {
      if (state.directionMode === '8way') {
        var nx = dx / d;
        var ny = dy / d;
        if (ny < -0.38) newDirs.up = true;
        if (ny > 0.38) newDirs.down = true;
        if (nx < -0.38) newDirs.left = true;
        if (nx > 0.38) newDirs.right = true;
        if (!newDirs.up && !newDirs.down && !newDirs.left && !newDirs.right) {
          if (Math.abs(nx) > Math.abs(ny)) {
            if (nx > 0) newDirs.right = true;
            else newDirs.left = true;
          } else {
            if (ny < 0) newDirs.up = true;
            else newDirs.down = true;
          }
        }
      } else {
        var absDx = Math.abs(dx);
        var absDy = Math.abs(dy);
        if (absDx > absDy) {
          if (dx > 0) newDirs.right = true;
          else newDirs.left = true;
        } else {
          if (dy < 0) newDirs.up = true;
          else newDirs.down = true;
        }
      }
    }

    var changed = false;
    var dirKeyMap = { up: moveKeys.up, down: moveKeys.down, left: moveKeys.left, right: moveKeys.right };
    var dots = this.getActiveDots();

    for (var dir in newDirs) {
      if (newDirs[dir] !== this.dirs[dir]) {
        changed = true;
        if (newDirs[dir]) {
          fireKey(dirKeyMap[dir], 'keydown');
          if (dots[dir]) dots[dir].classList.add('mgp-lit');
        } else {
          fireKey(dirKeyMap[dir], 'keyup');
          if (dots[dir]) dots[dir].classList.remove('mgp-lit');
        }
      }
    }

    if (changed) haptic(6);
    this.dirs = newDirs;
    if (this.onUpdate) this.onUpdate(this.dirs, norm);
  };

  Joystick.prototype.release = function() {
    this.active = false;
    this.touchId = null;

    var moveKeys = getMovementKeys();
    var dirKeyMap = { up: moveKeys.up, down: moveKeys.down, left: moveKeys.left, right: moveKeys.right };
    var dots = this.getActiveDots();
    for (var dir in this.dirs) {
      if (this.dirs[dir]) {
        fireKey(dirKeyMap[dir], 'keyup');
        if (dots[dir]) dots[dir].classList.remove('mgp-lit');
      }
    }
    this.dirs = { up: false, down: false, left: false, right: false };

    this.base.classList.remove('mgp-active');
    this.knob.classList.remove('mgp-active');
    this.knob.style.left = '50%';
    this.knob.style.top = '50%';

    this.floatBase.classList.remove('mgp-visible', 'mgp-active');
    this.floatKnob.classList.remove('mgp-active');
    this.floatKnob.style.left = '50%';
    this.floatKnob.style.top = '50%';

    if (this.onUpdate) this.onUpdate(this.dirs, 0);
  };

  Joystick.prototype.destroy = function() {
    if (this.zone && this.zone.parentNode) this.zone.parentNode.removeChild(this.zone);
    if (this.floatZone && this.floatZone.parentNode) this.floatZone.parentNode.removeChild(this.floatZone);
  };


  function DPad(overlay) {
    this.overlay = overlay;
    this.zone = null;
    this.buttons = {};
    this.touchMap = {};
    this.pressed = { up: false, down: false, left: false, right: false };
    this.build();
    this.bindEvents();
  }

  DPad.prototype.build = function() {
    this.zone = el('div', 'mgp-dpad-zone mgp-ctrl', this.overlay);
    var pad = el('div', 'mgp-dpad', this.zone);
    el('div', 'mgp-dpad-center', pad);

    var dirs = [
      { name: 'up', cls: 'mgp-dpad-up', icon: ICONS.arrowUp },
      { name: 'down', cls: 'mgp-dpad-down', icon: ICONS.arrowDown },
      { name: 'left', cls: 'mgp-dpad-left', icon: ICONS.arrowLeft },
      { name: 'right', cls: 'mgp-dpad-right', icon: ICONS.arrowRight }
    ];

    for (var i = 0; i < dirs.length; i++) {
      var btn = el('div', 'mgp-dpad-btn mgp-ctrl ' + dirs[i].cls, pad);
      btn.innerHTML = dirs[i].icon;
      btn.dataset.dir = dirs[i].name;
      this.buttons[dirs[i].name] = btn;
    }
  };

  DPad.prototype.updateVisibility = function() {
    this.zone.style.display = (state.inputMode === 'dpad' && state.showControls) ? '' : 'none';
  };

  DPad.prototype.applyScale = function() {
    var s = state.controlSize;
    this.zone.style.transform = 'scale(' + s + ')';
    this.zone.style.transformOrigin = 'bottom left';
  };

  DPad.prototype.bindEvents = function() {
    var self = this;

    this.zone.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var moveKeys = getMovementKeys();
      var dirKeyMap = { up: moveKeys.up, down: moveKeys.down, left: moveKeys.left, right: moveKeys.right };
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        var target = document.elementFromPoint(t.clientX, t.clientY);
        var btn = target ? target.closest('.mgp-dpad-btn') : null;
        if (btn && btn.dataset.dir) {
          var dir = btn.dataset.dir;
          self.touchMap[t.identifier] = dir;
          if (!self.pressed[dir]) {
            self.pressed[dir] = true;
            btn.classList.add('mgp-pressed');
            fireKey(dirKeyMap[dir], 'keydown');
            haptic(8);
          }
        }
      }
    }, { passive: false, capture: true });

    document.addEventListener('touchmove', function(e) {
      var moveKeys = getMovementKeys();
      var dirKeyMap = { up: moveKeys.up, down: moveKeys.down, left: moveKeys.left, right: moveKeys.right };
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        if (self.touchMap[t.identifier] !== undefined) {
          var target = document.elementFromPoint(t.clientX, t.clientY);
          var btn = target ? target.closest('.mgp-dpad-btn') : null;
          var oldDir = self.touchMap[t.identifier];
          var newDir = btn ? btn.dataset.dir : null;
          if (newDir !== oldDir) {
            if (oldDir && self.pressed[oldDir]) {
              self.pressed[oldDir] = false;
              self.buttons[oldDir].classList.remove('mgp-pressed');
              fireKey(dirKeyMap[oldDir], 'keyup');
            }
            if (newDir && !self.pressed[newDir]) {
              self.pressed[newDir] = true;
              self.buttons[newDir].classList.add('mgp-pressed');
              fireKey(dirKeyMap[newDir], 'keydown');
              haptic(6);
            }
            self.touchMap[t.identifier] = newDir;
          }
        }
      }
    }, { passive: false });

    var endHandler = function(e) {
      var moveKeys = getMovementKeys();
      var dirKeyMap = { up: moveKeys.up, down: moveKeys.down, left: moveKeys.left, right: moveKeys.right };
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        var dir = self.touchMap[t.identifier];
        if (dir !== undefined) {
          if (dir && self.pressed[dir]) {
            var stillHeld = false;
            for (var id in self.touchMap) {
              if (id != t.identifier && self.touchMap[id] === dir) {
                stillHeld = true;
                break;
              }
            }
            if (!stillHeld) {
              self.pressed[dir] = false;
              self.buttons[dir].classList.remove('mgp-pressed');
              fireKey(dirKeyMap[dir], 'keyup');
            }
          }
          delete self.touchMap[t.identifier];
        }
      }
    };

    document.addEventListener('touchend', endHandler, { passive: false });
    document.addEventListener('touchcancel', endHandler, { passive: false });
  };

  DPad.prototype.destroy = function() {
    if (this.zone && this.zone.parentNode) this.zone.parentNode.removeChild(this.zone);
  };


  function ActionButtons(overlay) {
    this.overlay = overlay;
    this.container = null;
    this.buttons = {};
    this.touchMap = {};
    this.pressed = {};
    this.build();
    this.bindEvents();
  }

  ActionButtons.prototype.build = function() {
    this.container = el('div', 'mgp-actions mgp-ctrl', this.overlay);

    var defs = [
      { id: 'a', cls: 'mgp-action-a', label: 'A' },
      { id: 'b', cls: 'mgp-action-b', label: 'B' },
      { id: 'x', cls: 'mgp-action-x', label: 'X' },
      { id: 'y', cls: 'mgp-action-y', label: 'Y' }
    ];

    for (var i = 0; i < defs.length; i++) {
      var btn = el('div', 'mgp-action-btn mgp-ctrl ' + defs[i].cls, this.container);
      btn.dataset.btnId = defs[i].id;
      this.buttons[defs[i].id] = btn;
      this.pressed[defs[i].id] = false;
    }

    this.updateLabels();
  };

  ActionButtons.prototype.getKeyForButton = function(id) {
    var map = { a: 'actionBindA', b: 'actionBindB', x: 'actionBindX', y: 'actionBindY' };
    return state[map[id]];
  };

  ActionButtons.prototype.updateLabels = function() {
    for (var id in this.buttons) {
      var keyCode = this.getKeyForButton(id);
      this.buttons[id].textContent = keyLabel(keyCode);
    }
  };

  ActionButtons.prototype.updateVisibility = function() {
    this.container.style.display = (state.actionButtons && state.showControls) ? '' : 'none';
  };

  ActionButtons.prototype.applyScale = function() {
    var s = state.controlSize;
    this.container.style.transform = 'scale(' + s + ')';
    this.container.style.transformOrigin = 'bottom right';
  };

  ActionButtons.prototype.bindEvents = function() {
    var self = this;

    this.container.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        var target = document.elementFromPoint(t.clientX, t.clientY);
        var btn = target ? target.closest('.mgp-action-btn') : null;
        if (btn && btn.dataset.btnId) {
          var id = btn.dataset.btnId;
          self.touchMap[t.identifier] = id;
          if (!self.pressed[id]) {
            self.pressed[id] = true;
            btn.classList.add('mgp-pressed');
            var keyCode = self.getKeyForButton(id);
            fireKey(keyCode, 'keydown');
            haptic(10);
          }
        }
      }
    }, { passive: false, capture: true });

    document.addEventListener('touchmove', function(e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        if (self.touchMap[t.identifier] !== undefined) {
          var target = document.elementFromPoint(t.clientX, t.clientY);
          var btn = target ? target.closest('.mgp-action-btn') : null;
          var oldId = self.touchMap[t.identifier];
          var newId = btn ? btn.dataset.btnId : null;
          if (newId !== oldId) {
            if (oldId && self.pressed[oldId]) {
              self.pressed[oldId] = false;
              self.buttons[oldId].classList.remove('mgp-pressed');
              fireKey(self.getKeyForButton(oldId), 'keyup');
            }
            if (newId && !self.pressed[newId]) {
              self.pressed[newId] = true;
              self.buttons[newId].classList.add('mgp-pressed');
              fireKey(self.getKeyForButton(newId), 'keydown');
              haptic(8);
            }
            self.touchMap[t.identifier] = newId;
          }
        }
      }
    }, { passive: false });

    var endHandler = function(e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        var id = self.touchMap[t.identifier];
        if (id !== undefined) {
          if (id && self.pressed[id]) {
            var stillHeld = false;
            for (var tid in self.touchMap) {
              if (tid != t.identifier && self.touchMap[tid] === id) {
                stillHeld = true;
                break;
              }
            }
            if (!stillHeld) {
              self.pressed[id] = false;
              self.buttons[id].classList.remove('mgp-pressed');
              fireKey(self.getKeyForButton(id), 'keyup');
            }
          }
          delete self.touchMap[t.identifier];
        }
      }
    };

    document.addEventListener('touchend', endHandler, { passive: false });
    document.addEventListener('touchcancel', endHandler, { passive: false });
  };

  ActionButtons.prototype.destroy = function() {
    if (this.container && this.container.parentNode) this.container.parentNode.removeChild(this.container);
  };


  function CursorSimulator(overlay) {
    this.overlay = overlay;
    this.dot = null;
    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
    this.touchId = null;
    this.active = false;
    this.dragging = false;
    this.lastTapTime = 0;
    this.doubleTapWindow = 320;
    this.dragStarted = false;
    this.build();
    this.bindEvents();
  }

  CursorSimulator.prototype.build = function() {
    this.dot = el('div', 'mgp-cursor-dot');
    this.dot.style.display = 'none';
    document.body.appendChild(this.dot);
  };

  CursorSimulator.prototype.updateVisibility = function() {
    if (state.cursorMode && state.showControls) {
      this.dot.style.display = '';
      this.dot.style.left = this.cursorX + 'px';
      this.dot.style.top = this.cursorY + 'px';
    } else {
      this.dot.style.display = 'none';
      if (this.dragging) this.endDrag();
    }
  };

  CursorSimulator.prototype.isControlElement = function(target) {
    if (!target) return false;
    return target.closest('.mgp-ctrl') ||
           target.closest('.mgp-panel') ||
           target.closest('.mgp-panel-backdrop') ||
           target.closest('.mgp-gear') ||
           target.closest('.mgp-switch-btn') ||
           target.closest('.mgp-kbd-btn');
  };

  CursorSimulator.prototype.dispatchMouse = function(type, x, y, extra) {
    var opts = {
      clientX: x, clientY: y,
      screenX: x, screenY: y,
      pageX: x + window.scrollX,
      pageY: y + window.scrollY,
      bubbles: true, cancelable: true, view: window
    };
    if (extra) {
      for (var k in extra) opts[k] = extra[k];
    }
    var target = document.elementFromPoint(x, y) || document.body;
    target.dispatchEvent(new MouseEvent(type, opts));
  };

  CursorSimulator.prototype.bindEvents = function() {
    var self = this;

    document.addEventListener('touchstart', function(e) {
      if (!state.cursorMode || !state.showControls) return;
      if (self.active) return;

      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        var target = document.elementFromPoint(t.clientX, t.clientY);
        if (self.isControlElement(target)) continue;

        e.preventDefault();
        self.touchId = t.identifier;
        self.active = true;

        var now = Date.now();
        var isDoubleTap = (now - self.lastTapTime) < self.doubleTapWindow;
        self.lastTapTime = now;

        if (isDoubleTap && state.doubleTapDrag) {
          self.dragging = true;
          self.dragStarted = true;
          self.dot.classList.add('mgp-dragging');
          self.dispatchMouse('mousedown', self.cursorX, self.cursorY, { button: 0 });
        }
        break;
      }
    }, { passive: false, capture: true });

    document.addEventListener('touchmove', function(e) {
      if (!self.active || self.touchId === null) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === self.touchId) {
          var t = e.changedTouches[i];
          self.cursorX = clamp(t.clientX, 0, window.innerWidth);
          self.cursorY = clamp(t.clientY, 0, window.innerHeight);
          self.dot.style.left = self.cursorX + 'px';
          self.dot.style.top = self.cursorY + 'px';
          self.dispatchMouse('mousemove', self.cursorX, self.cursorY);
          break;
        }
      }
    }, { passive: true });

    var endHandler = function(e) {
      if (!self.active || self.touchId === null) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === self.touchId) {
          if (self.dragging) {
            self.endDrag();
          } else if (!self.dragStarted) {
            self.dispatchMouse('click', self.cursorX, self.cursorY, { button: 0 });
          }
          self.active = false;
          self.touchId = null;
          self.dragStarted = false;
          break;
        }
      }
    };

    document.addEventListener('touchend', endHandler, { passive: true });
    document.addEventListener('touchcancel', endHandler, { passive: true });
  };

  CursorSimulator.prototype.endDrag = function() {
    this.dispatchMouse('mouseup', this.cursorX, this.cursorY, { button: 0 });
    this.dragging = false;
    this.dot.classList.remove('mgp-dragging');
  };

  CursorSimulator.prototype.destroy = function() {
    if (this.dot && this.dot.parentNode) this.dot.parentNode.removeChild(this.dot);
  };

  function KeyboardManager(overlay) {
    this.overlay = overlay;
    this.btn = null;
    this.input = null;
    this.kbVisible = false;
    this.build();
    this.bindEvents();
  }

  KeyboardManager.prototype.build = function() {
    this.btn = el('div', 'mgp-kbd-btn mgp-ctrl', this.overlay);
    this.btn.innerHTML = ICONS.keyboard;
    this.input = el('input', 'mgp-hidden-input');
    this.input.type = 'text';
    this.input.setAttribute('autocomplete', 'off');
    this.input.setAttribute('autocorrect', 'off');
    this.input.setAttribute('autocapitalize', 'off');
    this.input.setAttribute('spellcheck', 'false');
    document.body.appendChild(this.input);
  };

  KeyboardManager.prototype.updateVisibility = function() {
    this.btn.style.display = (state.virtualKeyboard && state.showControls) ? '' : 'none';
  };

  KeyboardManager.prototype.bindEvents = function() {
    var self = this;

    this.btn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (self.kbVisible) {
        self.input.blur();
        self.kbVisible = false;
      } else {
        self.input.focus();
        self.kbVisible = true;
      }
      haptic(10);
    }, { passive: false });

    this.input.addEventListener('blur', function() {
      self.kbVisible = false;
    });

    this.input.addEventListener('input', function() {
      self.input.value = '';
    });
  };

  KeyboardManager.prototype.destroy = function() {
    if (this.btn && this.btn.parentNode) this.btn.parentNode.removeChild(this.btn);
    if (this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
  };


  function SettingsPanel(overlay, onChanged) {
    this.overlay = overlay;
    this.onChanged = onChanged;
    this.gear = null;
    this.backdrop = null;
    this.panel = null;
    this.open = false;
    this.els = {};
    this.resetConfirm = false;
    this.build();
    this.bindGear();
  }

  SettingsPanel.prototype.build = function() {
    this.gear = el('div', 'mgp-gear mgp-ctrl', this.overlay);
    this.gear.innerHTML = ICONS.gear;

    this.backdrop = el('div', 'mgp-panel-backdrop');
    document.body.appendChild(this.backdrop);

    this.panel = el('div', 'mgp-panel');
    document.body.appendChild(this.panel);

    el('div', 'mgp-panel-handle', this.panel);
    var title = el('div', 'mgp-panel-title', this.panel);
    title.textContent = 'Gamepad Settings';

    this.buildInputSection();
    this.buildMovementSection();
    this.buildJoystickSection();
    this.buildActionSection();
    this.buildAdvancedSection();
    this.buildAppearanceSection();
    this.buildVersion();
    this.bindBackdrop();
    this.bindSwipe();
  };

  SettingsPanel.prototype.buildInputSection = function() {
    var section = el('div', 'mgp-section', this.panel);
    var label = el('div', 'mgp-section-label', section);
    label.textContent = 'INPUT MODE';

    var row = el('div', 'mgp-row', section);
    var seg = el('div', 'mgp-seg', row);

    var btnJoy = el('button', 'mgp-seg-btn', seg);
    btnJoy.textContent = 'Joystick';
    var btnDpad = el('button', 'mgp-seg-btn', seg);
    btnDpad.textContent = 'D-Pad';

    this.els.segJoystick = btnJoy;
    this.els.segDpad = btnDpad;

    var self = this;
    btnJoy.addEventListener('click', function() {
      state.inputMode = 'joystick';
      self.syncUI();
      self.emitChange();
    });
    btnDpad.addEventListener('click', function() {
      state.inputMode = 'dpad';
      self.syncUI();
      self.emitChange();
    });
  };

  SettingsPanel.prototype.buildMovementSection = function() {
    var section = el('div', 'mgp-section', this.panel);
    this.els.movementSection = section;

    var label = el('div', 'mgp-section-label', section);
    label.textContent = 'MOVEMENT KEYS';

    var row1 = el('div', 'mgp-row', section);
    var seg = el('div', 'mgp-seg', row1);

    var schemeKeys = Object.keys(MOVEMENT_SCHEMES);
    var self = this;
    this.els.schemeButtons = {};

    for (var i = 0; i < schemeKeys.length; i++) {
      (function(key) {
        var btn = el('button', 'mgp-seg-btn', seg);
        btn.textContent = MOVEMENT_SCHEMES[key].label;
        self.els.schemeButtons[key] = btn;
        btn.addEventListener('click', function() {
          state.movementScheme = key;
          self.syncUI();
          self.emitChange();
        });
      })(schemeKeys[i]);
    }

    var hintRow = el('div', '', section);
    this.els.schemeHint = el('div', 'mgp-scheme-hint', hintRow);

    this.els.customBindContainer = el('div', '', section);
    var customDirs = [
      { id: 'customUp', label: 'Up', stateKey: 'customMoveUp' },
      { id: 'customDown', label: 'Down', stateKey: 'customMoveDown' },
      { id: 'customLeft', label: 'Left', stateKey: 'customMoveLeft' },
      { id: 'customRight', label: 'Right', stateKey: 'customMoveRight' }
    ];

    for (var ci = 0; ci < customDirs.length; ci++) {
      (function(bind) {
        var row = el('div', 'mgp-bind-row', self.els.customBindContainer);
        var lbl = el('div', 'mgp-bind-label mgp-bind-label-wide', row);
        lbl.textContent = bind.label;
        var btn = el('div', 'mgp-bind-btn', row);
        btn.textContent = keyLabel(state[bind.stateKey]);
        btn.dataset.stateKey = bind.stateKey;
        self.els['bind_' + bind.id] = btn;

        btn.addEventListener('click', function() {
          self.cycleBinding(bind.stateKey, btn);
        });
      })(customDirs[ci]);
    }
  };

  SettingsPanel.prototype.buildJoystickSection = function() {
    var section = el('div', 'mgp-section', this.panel);
    this.els.joystickSection = section;

    var label = el('div', 'mgp-section-label', section);
    label.textContent = 'JOYSTICK';

    var row1 = el('div', 'mgp-row', section);
    var lbl1 = el('div', 'mgp-row-label', row1);
    lbl1.textContent = 'Position';
    var seg1 = el('div', 'mgp-seg', row1);
    var btnFixed = el('button', 'mgp-seg-btn', seg1);
    btnFixed.textContent = 'Fixed';
    var btnFloat = el('button', 'mgp-seg-btn', seg1);
    btnFloat.textContent = 'Float';
    this.els.segFixed = btnFixed;
    this.els.segFloat = btnFloat;

    var self = this;
    btnFixed.addEventListener('click', function() {
      state.joystickType = 'fixed';
      self.syncUI();
      self.emitChange();
    });
    btnFloat.addEventListener('click', function() {
      state.joystickType = 'floating';
      self.syncUI();
      self.emitChange();
    });

    var row2 = el('div', 'mgp-row', section);
    var lbl2 = el('div', 'mgp-row-label', row2);
    lbl2.textContent = 'Directions';
    var seg2 = el('div', 'mgp-seg', row2);
    var btn4 = el('button', 'mgp-seg-btn', seg2);
    btn4.textContent = '4-Way';
    var btn8 = el('button', 'mgp-seg-btn', seg2);
    btn8.textContent = '8-Way';
    this.els.seg4way = btn4;
    this.els.seg8way = btn8;

    btn4.addEventListener('click', function() {
      state.directionMode = '4way';
      self.syncUI();
      self.emitChange();
    });
    btn8.addEventListener('click', function() {
      state.directionMode = '8way';
      self.syncUI();
      self.emitChange();
    });
  };

  SettingsPanel.prototype.buildActionSection = function() {
    var section = el('div', 'mgp-section', this.panel);
    var label = el('div', 'mgp-section-label', section);
    label.textContent = 'ACTION BUTTONS';

    var toggleRow = el('div', 'mgp-row', section);
    var toggleLabel = el('div', 'mgp-row-label', toggleRow);
    toggleLabel.textContent = 'Show Buttons';
    this.els.toggleActions = this.createToggle(toggleRow, state.actionButtons);

    var self = this;
    this.els.toggleActions.el.addEventListener('click', function() {
      state.actionButtons = !state.actionButtons;
      self.updateToggle(self.els.toggleActions, state.actionButtons);
      self.syncUI();
      self.emitChange();
    });

    this.els.bindContainer = el('div', '', section);
    var binds = [
      { id: 'a', label: 'A', stateKey: 'actionBindA' },
      { id: 'b', label: 'B', stateKey: 'actionBindB' },
      { id: 'x', label: 'X', stateKey: 'actionBindX' },
      { id: 'y', label: 'Y', stateKey: 'actionBindY' }
    ];

    for (var i = 0; i < binds.length; i++) {
      (function(bind) {
        var row = el('div', 'mgp-bind-row', self.els.bindContainer);
        var lbl = el('div', 'mgp-bind-label', row);
        lbl.textContent = bind.label;
        var btn = el('div', 'mgp-bind-btn', row);
        btn.textContent = keyLabel(state[bind.stateKey]);
        btn.dataset.stateKey = bind.stateKey;
        self.els['bind_' + bind.id] = btn;

        btn.addEventListener('click', function() {
          self.cycleBinding(bind.stateKey, btn);
        });
      })(binds[i]);
    }
  };

  SettingsPanel.prototype.cycleBinding = function(stateKey, btn) {
    var current = state[stateKey];
    var idx = BINDABLE_KEYS.indexOf(current);
    idx = (idx + 1) % BINDABLE_KEYS.length;
    state[stateKey] = BINDABLE_KEYS[idx];
    btn.textContent = keyLabel(BINDABLE_KEYS[idx]);
    this.emitChange();
    haptic(6);
  };

  SettingsPanel.prototype.buildAdvancedSection = function() {
    var section = el('div', 'mgp-section', this.panel);
    var label = el('div', 'mgp-section-label', section);
    label.textContent = 'ADVANCED';

    var self = this;

    var row1 = el('div', 'mgp-row', section);
    var lbl1 = el('div', 'mgp-row-label', row1);
    lbl1.textContent = 'Cursor Mode';
    this.els.toggleCursor = this.createToggle(row1, state.cursorMode);
    this.els.toggleCursor.el.addEventListener('click', function() {
      state.cursorMode = !state.cursorMode;
      self.updateToggle(self.els.toggleCursor, state.cursorMode);
      self.syncUI();
      self.emitChange();
    });

    var row2 = el('div', 'mgp-row', section);
    this.els.doubleTapRow = row2;
    var lbl2 = el('div', 'mgp-row-label', row2);
    lbl2.textContent = 'Double-Tap Drag';
    this.els.toggleDoubleTap = this.createToggle(row2, state.doubleTapDrag);
    this.els.toggleDoubleTap.el.addEventListener('click', function() {
      state.doubleTapDrag = !state.doubleTapDrag;
      self.updateToggle(self.els.toggleDoubleTap, state.doubleTapDrag);
      self.emitChange();
    });

    var row3 = el('div', 'mgp-row', section);
    var lbl3 = el('div', 'mgp-row-label', row3);
    lbl3.textContent = 'Virtual Keyboard';
    this.els.toggleKeyboard = this.createToggle(row3, state.virtualKeyboard);
    this.els.toggleKeyboard.el.addEventListener('click', function() {
      state.virtualKeyboard = !state.virtualKeyboard;
      self.updateToggle(self.els.toggleKeyboard, state.virtualKeyboard);
      self.emitChange();
    });

    var row4 = el('div', 'mgp-row', section);
    var lbl4 = el('div', 'mgp-row-label', row4);
    lbl4.textContent = 'Haptic Feedback';
    this.els.toggleHaptic = this.createToggle(row4, state.hapticFeedback);
    this.els.toggleHaptic.el.addEventListener('click', function() {
      state.hapticFeedback = !state.hapticFeedback;
      self.updateToggle(self.els.toggleHaptic, state.hapticFeedback);
      self.emitChange();
      haptic(15);
    });
  };

  SettingsPanel.prototype.buildAppearanceSection = function() {
    var section = el('div', 'mgp-section', this.panel);
    var label = el('div', 'mgp-section-label', section);
    label.textContent = 'APPEARANCE';

    var self = this;

    var row1 = el('div', 'mgp-row', section);
    var lbl1 = el('div', 'mgp-row-label', row1);
    lbl1.textContent = 'Opacity';
    var wrap1 = el('div', 'mgp-slider-wrap', row1);
    var slider1 = el('input', 'mgp-slider mgp-ctrl', wrap1);
    slider1.type = 'range';
    slider1.min = '0.15';
    slider1.max = '0.9';
    slider1.step = '0.05';
    slider1.value = state.opacity;
    var val1 = el('div', 'mgp-slider-val', wrap1);
    val1.textContent = Math.round(state.opacity * 100) + '%';
    this.els.sliderOpacity = slider1;
    this.els.sliderOpacityVal = val1;

    slider1.addEventListener('input', function() {
      state.opacity = parseFloat(slider1.value);
      val1.textContent = Math.round(state.opacity * 100) + '%';
      self.emitChange();
    });

    var row2 = el('div', 'mgp-row', section);
    var lbl2 = el('div', 'mgp-row-label', row2);
    lbl2.textContent = 'Size';
    var wrap2 = el('div', 'mgp-slider-wrap', row2);
    var slider2 = el('input', 'mgp-slider mgp-ctrl', wrap2);
    slider2.type = 'range';
    slider2.min = '0.6';
    slider2.max = '1.5';
    slider2.step = '0.05';
    slider2.value = state.controlSize;
    var val2 = el('div', 'mgp-slider-val', wrap2);
    val2.textContent = Math.round(state.controlSize * 100) + '%';
    this.els.sliderSize = slider2;
    this.els.sliderSizeVal = val2;

    slider2.addEventListener('input', function() {
      state.controlSize = parseFloat(slider2.value);
      val2.textContent = Math.round(state.controlSize * 100) + '%';
      self.emitChange();
    });
  };

  SettingsPanel.prototype.buildVersion = function() {
    var section = el('div', 'mgp-section', this.panel);
    el('div', 'mgp-divider', section);

    var resetBtn = el('button', 'mgp-reset-btn', section);
    resetBtn.textContent = 'Reset to Defaults';
    this.els.resetBtn = resetBtn;

    var self = this;
    resetBtn.addEventListener('click', function() {
      if (self.resetConfirm) {
        for (var k in defaults) { state[k] = defaults[k]; }
        self.syncUI();
        self.emitChange();
        resetBtn.textContent = 'Reset to Defaults';
        self.resetConfirm = false;
        haptic(20);
      } else {
        self.resetConfirm = true;
        resetBtn.textContent = 'Tap Again to Confirm';
        haptic(10);
        setTimeout(function() {
          self.resetConfirm = false;
          resetBtn.textContent = 'Reset to Defaults';
        }, 3000);
      }
    });

    var v = el('div', 'mgp-version', this.panel);
    v.textContent = 'MobileGamepad v' + VERSION;
  };

  SettingsPanel.prototype.createToggle = function(parent, initialState) {
    var wrap = el('button', 'mgp-toggle mgp-ctrl', parent);
    if (initialState) wrap.classList.add('mgp-on');
    var thumb = el('div', 'mgp-toggle-thumb', wrap);
    return { el: wrap, thumb: thumb };
  };

  SettingsPanel.prototype.updateToggle = function(toggle, val) {
    if (val) toggle.el.classList.add('mgp-on');
    else toggle.el.classList.remove('mgp-on');
  };

  SettingsPanel.prototype.syncUI = function() {
    var j = state.inputMode === 'joystick';
    this.els.segJoystick.classList.toggle('mgp-active', j);
    this.els.segDpad.classList.toggle('mgp-active', !j);

    this.els.joystickSection.style.display = j ? '' : 'none';

    this.els.segFixed.classList.toggle('mgp-active', state.joystickType === 'fixed');
    this.els.segFloat.classList.toggle('mgp-active', state.joystickType === 'floating');

    this.els.seg4way.classList.toggle('mgp-active', state.directionMode === '4way');
    this.els.seg8way.classList.toggle('mgp-active', state.directionMode === '8way');

    var schemeKeys = Object.keys(MOVEMENT_SCHEMES);
    for (var si = 0; si < schemeKeys.length; si++) {
      var sk = schemeKeys[si];
      if (this.els.schemeButtons[sk]) {
        this.els.schemeButtons[sk].classList.toggle('mgp-active', state.movementScheme === sk);
      }
    }

    var isCustom = state.movementScheme === 'custom';
    this.els.customBindContainer.style.display = isCustom ? '' : 'none';

    if (!isCustom) {
      var scheme = MOVEMENT_SCHEMES[state.movementScheme] || MOVEMENT_SCHEMES.arrows;
      this.els.schemeHint.textContent = '\u2191 ' + keyLabel(scheme.up) + '  \u2193 ' + keyLabel(scheme.down) + '  \u2190 ' + keyLabel(scheme.left) + '  \u2192 ' + keyLabel(scheme.right);
      this.els.schemeHint.style.display = '';
    } else {
      this.els.schemeHint.style.display = 'none';
    }

    if (isCustom) {
      var customBinds = [
        { id: 'customUp', stateKey: 'customMoveUp' },
        { id: 'customDown', stateKey: 'customMoveDown' },
        { id: 'customLeft', stateKey: 'customMoveLeft' },
        { id: 'customRight', stateKey: 'customMoveRight' }
      ];
      for (var cb = 0; cb < customBinds.length; cb++) {
        var bindEl = this.els['bind_' + customBinds[cb].id];
        if (bindEl) bindEl.textContent = keyLabel(state[customBinds[cb].stateKey]);
      }
    }

    this.updateToggle(this.els.toggleActions, state.actionButtons);
    this.els.bindContainer.style.display = state.actionButtons ? '' : 'none';

    var btnIds = ['a','b','x','y'];
    for (var bi = 0; bi < btnIds.length; bi++) {
      var btnId = btnIds[bi];
      var stateKey = 'actionBind' + btnId.toUpperCase();
      if (this.els['bind_' + btnId]) {
        this.els['bind_' + btnId].textContent = keyLabel(state[stateKey]);
      }
    }

    this.updateToggle(this.els.toggleCursor, state.cursorMode);
    this.els.doubleTapRow.style.display = state.cursorMode ? '' : 'none';
    this.updateToggle(this.els.toggleDoubleTap, state.doubleTapDrag);
    this.updateToggle(this.els.toggleKeyboard, state.virtualKeyboard);
    this.updateToggle(this.els.toggleHaptic, state.hapticFeedback);

    this.els.sliderOpacity.value = state.opacity;
    this.els.sliderOpacityVal.textContent = Math.round(state.opacity * 100) + '%';
    this.els.sliderSize.value = state.controlSize;
    this.els.sliderSizeVal.textContent = Math.round(state.controlSize * 100) + '%';
  };

  SettingsPanel.prototype.bindGear = function() {
    var self = this;
    this.gear.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.toggle();
      haptic(10);
    }, { passive: false });
  };

  SettingsPanel.prototype.bindBackdrop = function() {
    var self = this;
    this.backdrop.addEventListener('touchstart', function(e) {
      e.preventDefault();
      self.close();
    }, { passive: false });
  };

  SettingsPanel.prototype.bindSwipe = function() {
    var self = this;
    var startY = 0;
    var startTime = 0;
    this.panel.addEventListener('touchstart', function(e) {
      if (e.target.closest('.mgp-slider') || e.target.closest('.mgp-toggle') ||
          e.target.closest('.mgp-seg-btn') || e.target.closest('.mgp-bind-btn')) return;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    }, { passive: true });
    this.panel.addEventListener('touchend', function(e) {
      var endY = e.changedTouches[0].clientY;
      var elapsed = Date.now() - startTime;
      if (endY - startY > 60 && elapsed < 400) {
        self.close();
      }
    }, { passive: true });
  };

  SettingsPanel.prototype.toggle = function() {
    if (this.open) this.close();
    else this.show();
  };

  SettingsPanel.prototype.show = function() {
    this.open = true;
    this.syncUI();
    this.gear.classList.add('mgp-open');
    this.backdrop.classList.add('mgp-visible');
    this.panel.classList.add('mgp-visible');
  };

  SettingsPanel.prototype.close = function() {
    this.open = false;
    this.gear.classList.remove('mgp-open');
    this.backdrop.classList.remove('mgp-visible');
    this.panel.classList.remove('mgp-visible');
  };

  SettingsPanel.prototype.emitChange = function() {
    saveState();
    if (this.onChanged) this.onChanged();
  };

  SettingsPanel.prototype.updateGearPosition = function() {
    if (state.actionButtons) {
      this.gear.style.bottom = '148px';
    } else {
      this.gear.style.bottom = '16px';
    }
  };

  SettingsPanel.prototype.destroy = function() {
    if (this.gear && this.gear.parentNode) this.gear.parentNode.removeChild(this.gear);
    if (this.backdrop && this.backdrop.parentNode) this.backdrop.parentNode.removeChild(this.backdrop);
    if (this.panel && this.panel.parentNode) this.panel.parentNode.removeChild(this.panel);
  };


  function MobileGamepad() {
    this.overlay = null;
    this.joystick = null;
    this.dpad = null;
    this.actionButtons = null;
    this.cursorSim = null;
    this.keyboardMgr = null;
    this.settings = null;
    this.switchBtn = null;
    this.orientationHandler = null;
    this.resizeHandler = null;
    this.visibilityHandler = null;
    this.init();
  }

  MobileGamepad.prototype.init = function() {
    injectCSS();
    this.overlay = el('div', 'mgp-overlay');
    document.body.appendChild(this.overlay);

    var self = this;

    this.joystick = new Joystick(this.overlay, function(dirs, magnitude) {
      self.emit('direction', { dirs: dirs, magnitude: magnitude });
    });
    this.dpad = new DPad(this.overlay);
    this.actionButtons = new ActionButtons(this.overlay);
    this.cursorSim = new CursorSimulator(this.overlay);
    this.keyboardMgr = new KeyboardManager(this.overlay);
    this.settings = new SettingsPanel(this.overlay, function() { self.applyState(); });

    this.buildSwitchButton();
    this.applyState();
    this.bindGlobalEvents();
    this.preventGhostInputs();
    this.installTouchIntercept();
  };

  MobileGamepad.prototype.installTouchIntercept = function() {
  };

  MobileGamepad.prototype.buildSwitchButton = function() {
    this.switchBtn = el('div', 'mgp-switch-btn mgp-ctrl', this.overlay);
    this.switchBtn.innerHTML = ICONS.swap;

    var self = this;
    this.switchBtn.addEventListener('touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      state.inputMode = state.inputMode === 'joystick' ? 'dpad' : 'joystick';
      saveState();
      self.applyState();
      haptic(10);
    }, { passive: false });
  };

  MobileGamepad.prototype.applyState = function() {
    this.overlay.style.opacity = state.opacity;

    this.joystick.updateVisibility();
    this.joystick.applyScale();

    this.dpad.updateVisibility();
    this.dpad.applyScale();

    this.actionButtons.updateVisibility();
    this.actionButtons.updateLabels();
    this.actionButtons.applyScale();

    this.cursorSim.updateVisibility();

    this.keyboardMgr.updateVisibility();

    this.settings.updateGearPosition();

    this.switchBtn.style.display = state.showControls ? '' : 'none';

    if (state.actionButtons) {
      this.switchBtn.style.bottom = '150px';
    } else {
      this.switchBtn.style.bottom = '16px';
    }

    var kbdBtn = this.keyboardMgr.btn;
    if (state.actionButtons && state.virtualKeyboard) {
      kbdBtn.style.bottom = '148px';
      kbdBtn.style.right = '60px';
    } else if (state.virtualKeyboard) {
      kbdBtn.style.bottom = '16px';
      kbdBtn.style.right = '60px';
    }
  };

  MobileGamepad.prototype.bindGlobalEvents = function() {
    var self = this;

    this.resizeHandler = function() {
      self.applyState();
    };
    window.addEventListener('resize', this.resizeHandler);

    this.orientationHandler = function() {
      setTimeout(function() { self.applyState(); }, 150);
    };
    window.addEventListener('orientationchange', this.orientationHandler);

    this.visibilityHandler = function() {
      if (document.hidden) {
        releaseAllKeys();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);

    document.addEventListener('fullscreenchange', function() {
      setTimeout(function() { self.applyState(); }, 200);
    });

    window.addEventListener('blur', function() {
      releaseAllKeys();
    });
  };

  MobileGamepad.prototype.preventGhostInputs = function() {
    this.overlay.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  };

  MobileGamepad.prototype.show = function() {
    state.showControls = true;
    saveState();
    this.applyState();
    this.overlay.style.display = '';
  };

  MobileGamepad.prototype.hide = function() {
    state.showControls = false;
    saveState();
    releaseAllKeys();
    this.overlay.style.display = 'none';
  };

  MobileGamepad.prototype.toggle = function() {
    if (state.showControls) this.hide();
    else this.show();
  };

  MobileGamepad.prototype.setOption = function(key, value) {
    if (state.hasOwnProperty(key)) {
      state[key] = value;
      saveState();
      this.applyState();
    }
  };

  MobileGamepad.prototype.getOption = function(key) {
    return state.hasOwnProperty(key) ? state[key] : undefined;
  };

  MobileGamepad.prototype.getState = function() {
    var copy = {};
    for (var k in state) copy[k] = state[k];
    return copy;
  };

  MobileGamepad.prototype.resetDefaults = function() {
    for (var k in defaults) {
      state[k] = defaults[k];
    }
    saveState();
    this.applyState();
    if (this.settings.open) {
      this.settings.syncUI();
    }
  };

  MobileGamepad.prototype.onDirectionChange = function(callback) {
    this.joystick.onUpdate = callback;
  };

  MobileGamepad.prototype.simulateKey = function(code, type) {
    fireKey(code, type || 'keydown');
  };

  var eventListeners = {};

  MobileGamepad.prototype.on = function(event, callback) {
    if (!eventListeners[event]) eventListeners[event] = [];
    eventListeners[event].push(callback);
    return this;
  };

  MobileGamepad.prototype.off = function(event, callback) {
    if (!eventListeners[event]) return this;
    eventListeners[event] = eventListeners[event].filter(function(cb) { return cb !== callback; });
    return this;
  };

  MobileGamepad.prototype.emit = function(event, data) {
    if (!eventListeners[event]) return;
    for (var i = 0; i < eventListeners[event].length; i++) {
      try { eventListeners[event][i](data); } catch(e) {}
    }
  };

  MobileGamepad.prototype.isPressed = function(code) {
    return !!pressedKeys[code];
  };

  MobileGamepad.prototype.getActiveDirections = function() {
    if (this.joystick) return { up: this.joystick.dirs.up, down: this.joystick.dirs.down, left: this.joystick.dirs.left, right: this.joystick.dirs.right };
    return { up: false, down: false, left: false, right: false };
  };

  MobileGamepad.prototype.getPressedKeys = function() {
    return Object.keys(pressedKeys);
  };

  MobileGamepad.prototype.isMobile = function() { return true; };

  MobileGamepad.prototype.getVersion = function() { return VERSION; };

  MobileGamepad.prototype.getMovementScheme = function() { return state.movementScheme; };

  MobileGamepad.prototype.setMovementScheme = function(scheme) {
    if (MOVEMENT_SCHEMES[scheme]) {
      state.movementScheme = scheme;
      saveState();
      this.applyState();
      if (this.settings.open) this.settings.syncUI();
    }
  };

  MobileGamepad.prototype.getAvailableSchemes = function() {
    return Object.keys(MOVEMENT_SCHEMES);
  };

  MobileGamepad.prototype.destroy = function() {
    releaseAllKeys();
    this.joystick.destroy();
    this.dpad.destroy();
    this.actionButtons.destroy();
    this.cursorSim.destroy();
    this.keyboardMgr.destroy();
    this.settings.destroy();
    if (this.switchBtn && this.switchBtn.parentNode) this.switchBtn.parentNode.removeChild(this.switchBtn);
    if (this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('orientationchange', this.orientationHandler);
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    var styleEl = document.getElementById('mgp-styles');
    if (styleEl) styleEl.parentNode.removeChild(styleEl);
    delete window.MobileGamepad;
  };

  var instance = null;

  function autoInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        instance = new MobileGamepad();
        window.MobileGamepad = instance;
      });
    } else {
      instance = new MobileGamepad();
      window.MobileGamepad = instance;
    }
  }

  autoInit();

})();