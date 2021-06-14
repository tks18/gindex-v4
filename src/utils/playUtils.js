import cdnpath from "@/libs/util.cdn";

export const srt2vtt = s =>
	'WEBVTT FILE\r\n\r\n' +
	s
		.replace(/\{\\([ibu])\}/g, '</$1>')
		.replace(/\{\\([ibu])1\}/g, '<$1>')
		.replace(/\{([ibu])\}/g, '<$1>')
		.replace(/\{\/([ibu])\}/g, '</$1>')
		.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
		.concat('\r\n\r\n')

export function players(url, title){
	return [
		{
			name: "IINA",
			icon: cdnpath("images/player/iina.png"),
			scheme: "iina://weblink?url=" + url,
		},
		{
			name: "PotPlayer",
			icon: cdnpath("images/player/potplayer.png"),
			scheme: "potplayer://" + url,
		},
		{
			name: "VLC",
			icon: cdnpath("images/player/vlc.png"),
			scheme: "vlc://" + url,
		},
		{
			name: "Cast2Tv",
			icon: "https://assets.materialup.com/uploads/b8e5d402-cd36-4774-bf10-0985e993a33e/preview",
			scheme: "intent:"+url+"#Intent;package=com.instantbits.cast.webvideo;S.title="+title+";end",
		},
		{
			name: "Thunder",
			icon: cdnpath("images/player/thunder.png"),
			scheme: "thunder://" + Buffer.from("AA" + url + "ZZ").toString("base64"),
		},
		{
			name: "nPlayer",
			icon: cdnpath("images/player/nplayer.png"),
			scheme: "nplayer-" + url,
		},
		{
			name: "MXPlayer(Free)",
			icon: cdnpath("images/player/mxplayer.png"),
			scheme:
				"intent:" +
				url +
				"#Intent;package=com.mxtech.videoplayer.ad;S.title=" +
				title +
				";end",
		},
		{
			name: "MXPlayer(Pro)",
			icon: cdnpath("images/player/mxplayer.png"),
			scheme:
				"intent:" +
				url +
				"#Intent;package=com.mxtech.videoplayer.pro;S.title=" +
				title +
				";end",
		},
	];
}
