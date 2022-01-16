import { v4 as uuidv4 } from 'uuid';

declare type ItemType = {
    data: DataType,
    prev: string,
    next: string
}

export declare type DataType = { 
    nextName: string,
    params: object
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
    
    _item(data: DataType, prev: string, next: string | null): ItemType{
        return {
            data,
            prev,
            next
        };
    }
    
    addQueue(val: DataType, key?: string):void{
        key = key || uuidv4();
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

    popQueue(): ItemType{
        if(this._mq.size){
            const current: ItemType = this._mq.get(this._front.prev);
            this._mq.delete(this._front.prev);
            this._front = this._mq.get(current.next || null);
            return current;
        }
        return null;
    }

    size(): number{
        return this._mq.size;
    }

    getQueue(): Map<string, ItemType>{
        return this._mq
    }
}

export default LinkQueueMap;
