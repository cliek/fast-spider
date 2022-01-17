"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = require("./pool");
var queue_1 = require("../queue");
var path_1 = require("path");
var EventEmitter = require("events");
var Spider = (function () {
    function Spider(size, taskPath) {
        var _this = this;
        this._roll = null;
        this._mq = new queue_1.default();
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
                    if (_this._fristTask) {
                        _this.exit();
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
        var tid = this._pool.findAvailableThread();
        if (typeof tid === 'string') {
            var _params = this._mq.popQueue();
            if (_params) {
                var _a = _params.data, nextName = _a.nextName, params = _a.params;
                this._pool.exec(tid, { taskName: nextName, data: params });
            }
            else {
                clearInterval(this._roll);
                this.exit();
                console.log('queueList is empty！');
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