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
    }
}

module.exports = demo;