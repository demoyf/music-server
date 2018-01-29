let demo = {
    hot_artist: {
        key: "hot_artist",
        one_page: 50,
        data_key_in_json: "artist",
        name: "热门歌手",
        redis_name: "hot_artist_name"
    },
    new_song: {
        key: "new_song_send",
        name: "新歌速递",
        data_key_in_json: "song_list",
        page_num: 20,
        redis_name: "hot_artist_name"
    },
    artist_db: {
        collection: "artistInfo",
        query: {
            ting_uid: "",
            artist_id: ""
        }
    },
    new_album_redis: {
        key: "new_album_redis"
    },
    artist_album_redis:{
        key:"artist_album_",
        data_key_in_json:"albumlist",
        page_num:20,
        redis_name:"artist_album_page_",
        name:"歌手专辑"
    }
}

module.exports = demo;