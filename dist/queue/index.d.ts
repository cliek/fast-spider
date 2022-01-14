declare type ItemType = {
    data: DataType;
    prev: string;
    next: string;
};
export declare type DataType = {
    nextName: string;
    params: object;
};
declare class LinkQueueMap {
    _front: ItemType | null;
    _rear: ItemType | null;
    _mq: Map<string, ItemType>;
    constructor();
    _item(data: DataType, prev: string, next: string | null): ItemType;
    addQueue(val: DataType, key?: string): void;
    popQueue(): ItemType;
    size(): number;
    getQueue(): Map<string, ItemType>;
}
export default LinkQueueMap;
//# sourceMappingURL=index.d.ts.map