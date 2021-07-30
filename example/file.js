const Pipe = require('../lib/utils/pipe');
const fs = require('fs')
const path = require('path')
const P = new Pipe({
    type: 'json',
    dirPath: 'data',
    fileName: 'test',
})
P.write({
    "sizeHD":0,
    "videoTopic":{
        "ename":"T1460515713131",
        "tname":"面呆围笑",
        "alias":"爱笑的人运气不会太差",
        "topic_icons":"http://img2.cache.netease.com/m/newsapp/topic_icons/T1460515713131.png",
        "tid":"T1460515713131"
    },
    "upTimes":0,
    "mp4Hd_url":null,
    "description":"",
    "title":"两个肉嘟嘟的小汪打架，可爱",
    "mp4_url":"http://flv3.bn.netease.com/a5ac835ed3249c762bd02ae730277b0c9b409e0a86ffad5e1124be336fcf8073fa5a96cfb86d084de796859e4a6e0c4ab69de3e5144f3a301aa7d1b1e250dfa1c35413ff3d53d6d17d2a664c88b63a28f7d682906374a02655e7712c9c60594e1c36b7508c37b546a5ab5c415f01ef392921518cbe853f1e.mp4",
    "vid":"VDB9RPOIC",
    "cover":"http://vimg3.ws.126.net/image/snapshot/2018/3/S/1/VDB9RPMS1.jpg",
    "sizeSHD":0,
    "playersize":0,
    "ptime":"2018-06-27 00:00:00",
    "m3u8_url":"http://flv.bn.netease.com/a5ac835ed3249c762bd02ae730277b0c7d0653aeea7e5ef0fbaed8fa02898d778d77bc41bf0305f1acdc6a1e45a3b00e104b375ac9bbdd0a132945c683371c5c52247d1cc7a9a913944669eadaf7cb03f0cc0fc13de2b517c5777077c67e0a0e662b5516e61f0866a9bf729cf320ee90df62ee369b419984.m3u8",
    "topicImg":"http://vimg1.ws.126.net/image/snapshot/2016/4/C/4/VBILQ3FC4.jpg",
    "votecount":0,
    "length":14,
    "videosource":"新媒体",
    "downTimes":0,
    "m3u8Hd_url":null,
    "sizeSD":609,
    "topicSid":"VBILQ3FC1",
    "commentStatus":1,
    "playCount":0,
    "replyCount":0,
    "replyBoard":"video_bbs",
    "replyid":"DB9RPOIC008535RB",
    "topicName":"面呆围笑",
    "sectiontitle":"",
    "topicDesc":"爱笑的人运气不会太差"
})