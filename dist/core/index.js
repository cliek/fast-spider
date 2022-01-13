"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_worker_threads_pool_1 = require("node-worker-threads-pool");
var queue_1 = require("../queue");
var path_1 = require("path");
var Spider = (function () {
    function Spider(size) {
        this._pool = new node_worker_threads_pool_1.StaticPool({
            size: size,
            task: (0, path_1.resolve)(__dirname, 'worker.js')
        });
        this._pool.on('next', this.nextTask);
    }
    Spider.prototype.addTask = function (tasks) {
        debugger;
        this._task = tasks.task;
        return this;
    };
    Spider.prototype.runTask = function (taskName, params) {
        var _this = this;
        this._pool.exec({
            param: params,
            timeout: 60000,
        }).then(function (res) {
            if (res) {
                debugger;
                _this._pool.emit('data', res);
            }
            else {
                debugger;
                _this._pool.emit('next', res);
            }
        }).catch(function (err) {
            if ((0, node_worker_threads_pool_1.isTimeoutError)(err))
                return _this._pool.emit('TimeoutError', err);
            _this._pool.emit('error', err);
        });
    };
    Spider.prototype.nextTask = function () {
        var _params = queue_1.default.popQueue();
        if (_params) {
            var _a = _params.data, taskName = _a.taskName, params = _a.params;
            this.runTask(taskName, params);
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