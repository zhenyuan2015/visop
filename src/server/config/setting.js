/**
 * 配置文件  默认是开发环境的配置
 *
 *
 * */
var config = {
    // 接口访问白名单，在此名单内的接口不需要鉴权就可以访问，否则会出错
    whiteList:[],
    useMysql: false,
    mysql: {
    "host"     : "localhost",
    "user"     : "your db user name",
    "password" : "password",
    "database":"your database",
    "acquireTimeout":10000,   // 
    "waitForConnections":true,
    "connectionLimit":10,
    "queueLimit":10
    },
    sms_service: "localhost",
    redis_server: process.env.REDIS_HOST || "localhost",
    useRedis:false,
    redis_port: 6379,
    redis_pwd:'redispassword',
    sendPassword:'sendPasswordFalse', // sendPasswordTrue为发送短信，默认开发环境不发送
    database: { // 数据库配置
        // host: process.env.MONGO_HOST || "localhost", // 服务器名称或IP
        host:process.env.MONGO_HOST || "localhost",
        port: 27017, // 数据库端口
        database: "yuntianyuan_dev", // 数据库名
        username: "mongouser", // 数据库链接访问用户名
        password: "password" // 数据库访问密码
    },
    session: { // session配置
        secretKey: "your secret",
        cookieName: "visop",
    },
    needAuth: false,
    verification_code_timeout: 10, //验证码有效时长，分钟
    db_server: "mongo",
    db_port: "27017",
    app_port: "8050",
    app_https_port: "8110",
    root_name: "zhongyi",
    upload_root: __dirname,
    root_app: __dirname + "/widget",
    path_api: __dirname + "/server/common",
    BaseApi: { isDebug: true },
    // url: "http://192.168.0.101",
    url: "http://www.yuntianyuan.net"
};
config.file_url = process.env.FILE_UPLOAD || (config.url + ":" + config.app_port);

// ***************************
// 全局函数
// 全局函数只能在app.js 中定义,并且必须是大写

global.API_PATH = __dirname + '/../api/'; // API 目录
global.ROOT_PATH = __dirname + '/../'; // 站点根目录
global.TOKEN_EXPIRATION_SEC = 3600*24*30; //token有效期
global.DEFAULT_PAGE_COUNT = 500; //分页默认配置

module.exports = config;