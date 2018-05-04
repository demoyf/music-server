let demo = {
    song: {
        collection: "song_list"
    },
    album_info: {
        collection: "album_info"
    },
    artist_db: {
        collection: "artistInfo",
        query: {
            ting_uid: "",
            artist_id: ""
        }
    }
}
if (!global.db_key) {
    global.db_key = demo;
}

module.exports = global.db_key;
