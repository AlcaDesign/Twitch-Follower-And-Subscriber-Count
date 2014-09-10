var https = require('https'),	// Load default https module
	fs = require('fs'),			// Load default fs module
	client_id = '',				// Define user variables
	channel = '',				// |
	message = '',				// |
	delay = 10000,				// |
	delaytimeout = false;		// |

function format(a,t){return t.replace(/%\w+%/g,function(k){return a[k]||k})}
function prettyJSON(d) { if(typeof d == 'string') return JSON.stringify(d, undefined, 4); return JSON.stringify(d, undefined, 4); }

function g() {
	function f() {
		var d = new Date;
		https.get('https://api.twitch.tv/kraken/channels/' + channel + '/follows?limit=1&client_id=' + client_id, function(r) {
				r.setEncoding('utf8');
				r.on('data', function(da) {
						da = JSON.parse(da);
						var end = +new Date;
							t =	[	(d.getMonth() + 1	< 10 ? '0' : '') + d.getMonth() + 1,
									(d.getDate()		< 10 ? '0' : '') + d.getDate(),
									(d.getFullYear()	< 10 ? '0' : '') + d.getFullYear()
								].join('/') + ' - ' +
								[
									d.getHours()%12 == 0 ? 12 : (d.getHours() < 10 ? '0' : '') + d.getHours()%12,
									(d.getMinutes() < 10 ? '0' : '') + d.getMinutes(),
									(d.getSeconds() < 10 ? '0' : '') + d.getSeconds() + '.' +
									('' + +d).slice(-3)
								].join(':') + ' - ';
						
						if(!!da.follows) {
							console.log(t + 'Updated file. ('+da._total+') (Took ' + (end - d) + 'ms)');
							fs.writeFile('followers.txt', format({'%COUNT%': da._total, '%LAST_FOLLOWER%': da.follows[0].user.display_name, '%CHANNEL%': channel, '%RAW_JSON%': JSON.stringify(da)}, message));
							if(delaytimeout) setTimeout(g, delay);
						}
						else console.log(da);
					});
			}).on('error', function(e) {
				console.error('ERROR: ' + e.message);
			});
	}
}
if(fs.existsSync('config.json')) {
	
	var config = null;
	
	try {
		config = JSON.parse(fs.readFileSync('config.json'));
	}
	catch(e) {
		console.err(e);
	}
	
	if(!!config &&
	   config.hasOwnProperty('client_id')	&& config.client_id			!== ''		&&
	   config.hasOwnProperty('channel')		&& config.channel			!== ''		&&
	   config.hasOwnProperty('info')		&& config.info				!== ''		&&
	   config.hasOwnProperty('message')		&& config.message			!== ''		&&
	   config.hasOwnProperty('delay_sec')	&& typeof config.delay_sec	== 'number'	&&
	   config.hasOwnProperty('delay_to')	&& typeof config.delay_to	== 'boolean') {
			client_id		=	config.client_id	|| '';
			channel			=	config.channel		|| 'test_channel';
			info			=	config.info			|| 'followers';
			message			=	config.message		|| '%FOLLOWERCOUNT% followers';
			getfol			=	(info.indexOf('fol') > -1 || info == 'both') && (message.indexOf('%FOLLOWER_COUNT%') || message.indexOf('%FOLLOWER_COUNT%'));
			getsub			=	(info.indexOf('sub') > -1 || info == 'both');
			delay			=	config.delay_sec*1000;
			delaytimeout 	=	config.delay_to;
			
			console.log({ client_id: client_id, channel: channel, info: info, message: message, delay: delay, delaytimeout: delaytimeout });
			
			g();
			if(!delaytimeout) setInterval(g, delay);
	}
	else {
		console.error('Incorrect config. Check for errors in the JSON like missing elements and empty strings. You can delete your config.json and rerun the script to recreate a correctly formatted configuration file.');
		setTimeout('', 10000);
	}

}
else fs.writeFile('config.json',
		prettyJSON({
			__comment:		'Visit the repository on GitHub for documentation: github.com/AlcaDesign/Twitch-Follower-And-Subscriber-Count/',
			client_id:		'asdf123asdf123asdf123asdf123asd',
			oauth_token:	'123asdf123asdf123asdf123asdf123',
			channel:		'channelname',
			info:			'followers',
			message_args:	['%CHANNEL%', '%FOLLOWER_COUNT%', '%SUBSCRIBER_COUNT%', '%LAST_FOLLOWER%', '%LAST_SUBSCRIBER%', '%RAW_JSON%'],
			follower_message:		'%FOLLOWERCOUNT% followers. Last follower: %LAST_FOLLOWER%',
			subscriber_message:		'%SUBSCRIBER_COUNT% subscribers. Last subscriber: %LAST_SUBSCRIBER%',
			delay_sec:		5,
			delay_to:		false
	}),
		function() {
			console.error('No config file found. Created one.');
			setTimeout('', 3000);
	});