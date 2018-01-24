let url = {
	// query  歌手信息，用来查找  type:-1 所有  1歌手
	QUERY_SEARCH_ALL_URL:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=5.6.5.0&method=baidu.ting.search.merge&format=json&page_no=1&page_size=10000&data_source=0&use_cluster=1&",
	
	// 搜索建议  query
	QUERY_SRARCH_SUGGESSTIONS:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=5.6.5.0&method=baidu.ting.search.catalogSug&format=json&",

	//  tinguid/offset/limits  获取歌手专辑
	QUERY_ARTIST_ALBUM_URL:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=5.6.5.0&method=baidu.ting.artist.getAlbumList&format=json&order=1&",
	
	// 播放音乐 songid
	PLAY_URL:"http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&",
	
	// 根据歌手id查找歌手音乐列表 tinguid aritstid offset limits
	QUERY_SONG_LIST_BY_TING_UID:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.artist.getSongList&format=json&",

	// 新歌速递  limit offset
	QUERY_NEW_SONG:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.plaza.getNewSongs&format=json",

	// 榜单 type offset size  type:1新歌榜  2热歌榜  6 KTV热歌榜 8 BILLBOARD
	// 11 摇滚榜 12 爵士榜 16 流行 18 hito中文榜 21 欧美金曲  22 经典老歌 23 情歌对唱榜 24 影视金曲 25 网络歌曲
	QUERY_BILL_BOARD:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.billboard.billList&format=json&",

	// tinguid artistid 获取歌手信息
	QUERY_ARTISTS_INFO:" http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.artist.getinfo&format=json&",

	// 新专辑速递  offset limit
	QUERY_RECOMMEND:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.plaza.getRecommendAlbum&format=json&",

	// album_id  获取专辑信息
	QUERY_ALBUM_INFO:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.album.getAlbumInfo&format=json&",

	// 获取电台列表
	QUERY_CATEGORY:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.radio.getCategoryList&format=json",

	// channelname  获取电台下的所有音乐列表
	QUERY_CATEGORY_MUSIC:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.radio.getChannelSong&format=json&pn=0&rn=10&",

	// 歌手列表 offset limit
	QUERY_ARTIST_LIST:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.artist.getList&format=json&",

	// 热门歌手
	QUERY_HOT_ARITIS:"http://tingapi.ting.baidu.com/v1/restserver/ting?from=qianqian&version=2.1.0&method=baidu.ting.artist.get72HotArtist&format=jsonℴ=1&offset=0&limit=100"	
}

module.exports = url;