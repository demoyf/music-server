let demo = {
    DB_CONNECT_STR: "mongodb://127.0.0.1:27017/music",
    DB_NAME: "name"
};
if (!global.db_config) {
    global.db_config = demo;
}
module.exports = global.db_config;