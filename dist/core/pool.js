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
var thread_1 = require("./thread");
var readline = require("readline");
var EventEmitter = require("events");
var Pool = (function () {
    function Pool(size, workerPath, workerData) {
        this.allThreads = {};
        this.poolSize = size;
        this.workerPath = workerPath;
        this.workerData = workerData;
        this.events = new EventEmitter();
        this.startMultipleThread();
    }
    Pool.prototype.startMultipleThread = function () {
        var _this = this;
        var _loop_1 = function (index) {
            var _worker = new thread_1.default(this_1.workerPath, {
                workerData: this_1.workerData
            });
            this_1.allThreads[String(_worker.threadId)] = _worker;
            _worker.worker.on("message", function (res) {
                var type = res.type;
                if (type === 'done') {
                    _worker.setState("IDLE");
                }
                else if (type === 'error') {
                    _worker.setState("IDLE");
                }
                _this.events.emit('message', __assign({ threadId: _worker.threadId }, res));
            });
            _worker.worker.on("exit", function (exitCode) {
                if (exitCode === 0) {
                    _this.poolSize--;
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write("Thread exits with ".concat(_this.poolSize, " remaining!\n"));
                }
                else {
                    throw new Error(_worker.worker.threadId + "process exit error");
                }
            });
        };
        var this_1 = this;
        for (var index = 0; index < this.poolSize; index++) {
            _loop_1(index);
        }
        return this;
    };
    Pool.prototype.findAvailableThread = function () {
        for (var key in this.allThreads) {
            if (this.allThreads[key].state === 'IDLE') {
                return key;
            }
        }
        readline.cursorTo(process.stdout, 0);
        process.stdout.write('allThread is busy!\n');
        return false;
    };
    Pool.prototype.exec = function (treadId, task) {
        this.allThreads[treadId].run(task);
    };
    Pool.prototype.destroy = function () {
        for (var key in this.allThreads) {
            this.allThreads[key].worker.postMessage({
                type: "exit"
            });
        }
    };
    return Pool;
}());
exports.default = Pool;
//# sourceMappingURL=pool.js.map