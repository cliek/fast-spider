"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var LinkQueueMap = (function () {
    function LinkQueueMap() {
        this._front = null;
        this._rear = null;
        this._mq = new Map();
    }
    LinkQueueMap.prototype._item = function (data, prev, next) {
        return {
            data: data,
            prev: prev,
            next: next
        };
    };
    LinkQueueMap.prototype.addQueue = function (val, key) {
        key = key || (0, uuid_1.v4)();
        if (this.size() === 0) {
            this._front = this._item(val, key, null);
            this._rear = this._item(val, key, null);
        }
        else {
            this._rear.next = key;
            this._rear = this._item(val, key, null);
        }
        this._mq.set(this._rear.prev, this._rear);
    };
    LinkQueueMap.prototype.popQueue = function () {
        if (this._mq.size) {
            var current = this._mq.get(this._front.prev);
            this._mq.delete(this._front.prev);
            this._front = this._mq.get(current.next || null);
            return current;
        }
        return null;
    };
    LinkQueueMap.prototype.size = function () {
        return this._mq.size;
    };
    LinkQueueMap.prototype.getQueue = function () {
        return this._mq;
    };
    return LinkQueueMap;
}());
exports.default = LinkQueueMap;
//# sourceMappingURL=index.js.map