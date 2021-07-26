const _front = Symbol('front');
const _rear = Symbol('rear');
const _mq = Symbol('mq');
const _Item = Symbol('mq');

class LinkQueueMap {
    constructor(){
        this[_front] = null;
        this[_rear] = null;
        this[_mq] = new Map();
    }
    
    [_Item](data, prev, next){
        return {
            data: data,
            prev: prev,
            next: next
        };
    }
    
    add(key, val){
        if(this.size() === 0){
            // 存入第一个对象在游标项中
            this[_front] = this[_Item](val, key, null);
            this[_rear] = this[_Item](val, key, null);
        }else{
            this[_rear].next = key;
            this[_mq].set(this[_rear].prev, this[_rear]);
            this[_rear] = this[_Item](val, key, null);
        }
        this["hook:add"](key, val)
    }

    pop(){
        if(this[_mq].size){
            const current = this[_mq].get(this[_front].prev);
            this[_mq].delete(this[_front].prev);
            this[_front] = this[_mq].get(current.next || '');
            this.popHooks(current);
            return current;
        }else{
            const current = this[_front] || this[_rear];
            this[_front] = this[_rear] = null;
            this.popHooks(current);
            return current;
        }
    }

    size(){
        if(this[_front]){
            return this[_mq].size + 1;
        }else{
            return this[_mq].size;
        }
    }

    getQM(){
        return this[_mq]
    }

    addHooks(cb)

    popHooks(cb)
}
const Q = new LinkQueueMap();
exports.add = Q.add.bind(Q);
exports.pop = Q.pop.bind(Q);
exports.size = Q.size.bind(Q);
