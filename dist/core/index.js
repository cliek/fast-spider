"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_worker_threads_pool_1 = require("node-worker-threads-pool");
var queue_1 = require("../queue");
var path_1 = require("path");
var EventEmitter = require("events");
var Spider = (function () {
    function Spider(size, taskPath) {
        this._mq = new queue_1.default();
        this._pool = new node_worker_threads_pool_1.StaticPool({
            size: size,
            task: (0, path_1.resolve)(__dirname, 'worker.js'),
            workerData: {
                taskPath: taskPath
            }
        });
        this._events = new EventEmitter();
    }
    Spider.prototype.runTask = function (taskName, data) {
        var _this = this;
        this._pool.exec({
            taskName: taskName,
            data: data
        }, 60000).then(function (res) {
            var type = res.type, result = res.result;
            switch (type) {
                case 'queue':
                    _this._mq.addQueue({
                        nextName: result.nextName,
                        params: result.data
                    });
                    _this._events.emit('next', result);
                    break;
                case 'done':
                    _this.nextTask();
                    _this._events.emit('data', res);
                    break;
                case 'error':
                    _this._events.emit('error', res);
                    break;
            }
        }).catch(function (err) {
            if ((0, node_worker_threads_pool_1.isTimeoutError)(err))
                return _this._events.emit('TimeoutError', err);
            _this._events.emit('error', err);
        });
        return this;
    };
    Spider.prototype.nextTask = function () {
        var _params = this._mq.popQueue();
        if (_params) {
            var _a = _params.data, nextName = _a.nextName, params = _a.params;
            this.runTask(nextName, params);
        }
        else {
            this.exit();
        }
    };
    Spider.prototype.exit = function () {
        this._pool.destroy();
    };
    return Spider;
}());
exports.default = Spider;
//# sourceMappingURL=index.js.map