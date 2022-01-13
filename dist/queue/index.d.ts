declare type ItemType = {
    data: DataType;
    prev: string;
    next: string;
};
declare type DataType = {
    taskName: string;
    params: object;
};
declare class LinkQueueMap {
    _front: ItemType | null;
    _rear: ItemType | null;
    _mq: Map<string, ItemType>;
    constructor();
    _item(data: DataType, prev: string, next: string | null): ItemType;
    addQueue(key: string, val: DataType): void;
    popQueue(): ItemType;
    size(): number;
    getQueue(): Map<string, ItemType>;
}
declare const Q: LinkQueueMap;
export default Q;
//# sourceMappingURL=index.d.ts.map