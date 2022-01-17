"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = require("./pool");
var queue_1 = require("../queue");
var path_1 = require("path");
var EventEmitter = require("events");
var Spider = (function () {
    function Spider(size, taskPath, opt) {
        var _this = this;
        this._roll = null;
        this._roll_next = null;
        this._mq = new queue_1.default();
        this._option = __assign({ isExit: true }, opt);
        this.events = new EventEmitter();
        this._fristTask = true;
        this._pool = new pool_1.default(size, (0, path_1.resolve)(__dirname, 'worker.js'), {
            taskPath: taskPath
        });
        this._pool.events.on('message', function (res) {
            var type = res.type, result = res.result;
            switch (type) {
                case 'queue':
                    _this._mq.addQueue({
                        nextName: result.nextName,
                        params: result.data
                    });
                    _this.events.emit('next', result);
                    if (_this._fristTask) {
                        _this.rollTask();
                        _this._fristTask = false;
                    }
                    break;
                case 'done':
                    _this.events.emit('data', res);
                    if (_this._fristTask && _this._option.isExit) {
                        _this.exit();
                        _this.events.emit('exit');
                    }
                    break;
                case 'error':
                    _this.events.emit('error', res);
                    break;
            }
        });
    }
    Spider.prototype.runTask = function (taskName, data) {
        this._pool.exec("1", {
            taskName: taskName,
            data: data
        });
        return this;
    };
    Spider.prototype.nextTask = function () {
        var _this = this;
        var _a;
        var tid = this._pool.findAvailableThread();
        if (typeof tid === 'string') {
            var _params = this._mq.popQueue();
            if (_params) {
                var _b = _params.data, nextName = _b.nextName, params = _b.params;
                this._pool.exec(tid, { taskName: nextName, data: params });
                if (this._roll_next)
                    clearTimeout(this._roll_next);
            }
            else if ((_a = this._option) === null || _a === void 0 ? void 0 : _a.isExit) {
                console.log('queueList is empty！');
                this._roll_next = setTimeout(function () {
                    clearInterval(_this._roll);
                    _this.exit();
                }, 5000);
            }
        }
    };
    Spider.prototype.rollTask = function () {
        this._roll = setInterval(this.nextTask.bind(this), 300);
    };
    Spider.prototype.exit = function () {
        this._pool.destroy();
    };
    return Spider;
}());
exports.default = Spider;
//# sourceMappingURL=index.js.map