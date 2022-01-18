import { Sequelize } from 'sequelize';

const db = new Sequelize('spider-hot', 'root', '123456', {
    dialect: 'mysql',    //数据库类型
    host: '127.0.0.1',   //主机地址
    port: "3306",
    pool: {      //连接池设置
        max: 1,  //最大连接数
        idle: 30000,
        acquire: 60000
    },
    dialectOptions:{
        charset:'utf8mb4',  //字符集
        collate:'utf8mb4_unicode_ci'
    },
    define: {   //模型设置
        freezeTableName: true,    //自定义表面，不设置会自动将表名转为复数形式
        timestamps: false    //自动生成更新时间、创建时间字段：updatedAt,createdAt
    }
});

db.define('hot_search', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowedNull: false
    },
    image: {
        type: Sequelize.STRING,
    },
    hotType: {
        field: 'hot_type',
        type: Sequelize.STRING(10),
    },
    hotSocpe: {
        field: 'hot_socpe',
        type: Sequelize.STRING(20)
    },
    link: {
        type: Sequelize.STRING
    },
    createTime: {
        field: 'create_time',
        type: Sequelize.STRING(15),
        defaultValue: new Date().getTime()
    },
    description: {
        type: Sequelize.TEXT
    },
    extraList: {
        field: 'extra_list',
        type: 'text',
        allowedNull:false 
    }
},{
    freezeTableName: true
})

db.authenticate().then(()=>{
    db.sync({force:true})
    console.log("数据库已连接！")
}).catch(err=>{
    console.log(err)
    console.log("连接失败")
});

export default db;