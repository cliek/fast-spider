
declare type ItemType = {
    data: object,
    prev: string,
    next: string
}

class LinkQueueMap {
    public _front: ItemType | null;
    public _rear: ItemType | null;
    public _mq: Map<string, ItemType>;

    constructor(){
        this._front = null;
        this._rear = null;
        this._mq = new Map();
    }
    
    _item(data: object, prev: string, next: string | null): ItemType{
        return {
            data,
            prev,
            next
        };
    }
    
    addQueue(key: string, val: object):void{
        if(this.size() === 0){
            // 存入第一个对象在游标项中
            this._front = this._item(val, key, null);
            this._rear = this._item(val, key, null);
        }else{
            this._rear.next = key;
            this._rear = this._item(val, key, null);
        }
        this._mq.set(this._rear.prev, this._rear);
    }

    popQueue(): object{
        if(this._mq.size){
            const current = this._mq.get(this._front.prev);
            this._mq.delete(this._front.prev);
            this._front = this._mq.get(current.next || '');
            return current;
        }else{
            const current = this._front || this._rear;
            this._front = this._rear = null;
            return current;
        }
    }

    size(): number{
        if(this._front){
            return this._mq.size + 1;
        }else{
            return this._mq.size;
        }
    }

    getQueue(): Map<string, ItemType>{
        return this._mq
    }
}

const Q = new LinkQueueMap();

export default Q;

export const addQueue = Q.addQueue.bind(Q);
export const popQueue = Q.popQueue.bind(Q);
export const getQueue = Q.getQueue.bind(Q);
