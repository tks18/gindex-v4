export const srt2vtt = s =>
	'WEBVTT FILE\r\n\r\n' +
	s
		.replace(/\{\\([ibu])\}/g, '</$1>')
		.replace(/\{\\([ibu])1\}/g, '<$1>')
		.replace(/\{([ibu])\}/g, '<$1>')
		.replace(/\{\/([ibu])\}/g, '</$1>')
		.replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
		.concat('\r\n\r\n')
