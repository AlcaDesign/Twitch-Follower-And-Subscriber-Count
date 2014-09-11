var https	= require('https'),	// Load default https module
	fs		= require('fs'),	// Load default fs module
	
	strt_followercount	= 0;	// Use for comparing and tracking follower count
	strt_subscribercount= 0;	// Use for comparing and tracking subscriber count
	old_followercount	= 0;	// Use for coloring, notifying, and tracking follower count
	old_subscribercount	= 0;	// Use for coloring, notifying, and trakcing subscriber count
	
	client_id		= '',		// Define user variables
	channel			= '',		// |
	info			= '',		// |
	fol_message		= '',		// |
	sub_message		= '',		// |
	both_message	= '',		// |
	getfol			= '',		// |
	fetsub			= '',		// |
	getboth			= '',		// |
	message			= '',		// |
	delay			= 10000,	// |
	delaytimeout	= false;	// |

function format(a,t){return t.replace(/%\w+%/g,function(k){return a[k]||k})}
function prettyJSON(d){if(typeof d == 'string') return JSON.stringify(d, undefined, 4); return JSON.stringify(d, undefined, 4)}
function formDateTime(d){return [(d.getMonth()+1<10?'0':'')+d.getMonth()+1,(d.getDate()<10?'0':'')+d.getDate(),(d.getFullYear()<10?'0':'')+d.getFullYear()].join('/')+' - '+[d.getHours()%12==0?12:(d.getHours()<10?'0':'')+d.getHours()%12,(d.getMinutes()<10?'0':'')+d.getMinutes(),(d.getSeconds()<10?'0':'')+d.getSeconds()+'.'+(''+ +d).slice(-3)].join(':')+' - '}

function g() {
	function log(m, c, s, p, t) {
		var color = '', delta = c - s;
		if(c > p) color = '\033[92m'; // Green
		else if(c < p) color = '\033[91m'; // Red
		delta = '(' + ( delta > 0 ? '\033[92m+' : ( delta < 0 ? '\033[91m' : '' )) + delta; // Green | Red | None
		console.log(m + ' (' + color + c + '\033[39m ' + delta + '\033[39m)) (Took ' + t + 'ms)');
	}
	function run(type, callback, adlcb, cbData, addlCallback) {
		var d = new Date;
		https.get('https://api.twitch.tv/kraken/channels/' + channel + '/' + type + '?limit=1&client_id=' + client_id, function(r) {
				r.setEncoding('utf8');
				if(adlcb)	r.on('data', function(b) { callback(b, d, adlcb, cbData, addlCallback) });
				else		r.on('data', function(b) { callback(b, d) });
			}).on('error', function(e) {
				console.error('ERROR: ' + e.message);
			});
	}
	function fol(data, date, doCallback) {
		da = JSON.parse(data);
		var end = +new Date;
			t =	formDateTime(date);
		
		if(!!da.follows) {
			if(strt_followercount == 0) strt_followercount = da._total;
			
			log(t + 'Updated followers file.', da._total, strt_followercount, old_followercount, end - date);
			
			old_followercount = da._total;
			
			fs.writeFile('followers.txt', format({
					'%FOLLOWER_COUNT%':	da._total,
					'%LAST_FOLLOWER%':	da.follows[0].user.display_name,
					'%CHANNEL%':		channel,
					'%RAW_JSON%':		JSON.stringify(da)
				}, fol_message));
			
			if(doCallback) {
				run('subscriptions', sub, true, da, function(fd, sd) {
						
					});
			}
			else if(delaytimeout) setTimeout(g, delay);
		}
		else console.log(t, da);
	}
	function sub(data, date, doCallback, callbackData, addlCallback) {
		da = JSON.parse(data);
		var end = +new Date;
			t =	formDateTime(date);
		
		if(!!da.subscribers) {
			if(strt_subscribercount == 0) strt_subscribercount = da._total;
			
			log(t + 'Updated subscribers file.', da._total, strt_subscribercount, old_subscribercount, end - date);
			
			old_subscribercount = da._total;
			
			fs.writeFile('subscribers.txt', format({
					'%SUBSCRIBER_COUNT%':	da._total,
					'%LAST_SUBSCRIBER%':	da.subscriptions[0].user.display_name,
					'%CHANNEL%':			channel,
					'%RAW_JSON%':			JSON.stringify(da2)
				}, sub_message));
			
			if(doCallback) addlCallback(da, callbackData);
			
			if(delaytimeout) setTimeout(g, delay);
		}
		else {
			console.log(t, da);
			if(da.error == 'Unauthorized') {
				getsub = false;
				console.log('\033[91m[NOTICE] Unauthorized. \033[39mDisabled checking for subscriptions.');
			}
		}
	}
	
	if(getfol && getsub) {
		run('follows', fol, true);
	}
	else if(getfol) {
		run('follows', fol);
	}
	else if(getsub) {
		run('subscriptions', sub);
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
		config.hasOwnProperty('channel')	&& config.channel			!== ''		&&
		config.hasOwnProperty('info')		&& config.info				!== ''		&&
		config.hasOwnProperty('delay_sec')	&& typeof config.delay_sec	== 'number'	&&
		config.hasOwnProperty('delay_to')	&& typeof config.delay_to	== 'boolean') {
			
			client_id		=	config.client_id			|| '';
			channel			=	config.channel				|| 'test_channel';
			info			=	config.info					|| 'followers';
			//message		=	config.message				|| '%FOLLOWERCOUNT% followers';
			fol_message		=	config.follower_message		|| '';
			sub_message		=	config.subscriber_message	|| '';
			both_message	=	config.both_message			|| '';
			
			getfol			=	(info.indexOf('fol') > -1 || info == 'both') && (message.indexOf('%FOLLOWER_COUNT%')		|| message.indexOf('%FOLLOWER_COUNT%'));
			getsub			=	(info.indexOf('sub') > -1 || info == 'both') && (message.indexOf('%SUBSCRIBERER_COUNT%')	|| message.indexOf('%SUBSCRIBERER_COUNT%'));
			getboth			=	getfol && getsub;
			
			if(getfol || getsub) {
				if(getboth && (config.hasOwnProperty('both_message') && config.both_message !== '')) {
				}
				
				delay			=	config.delay_sec*1000;
				delaytimeout 	=	config.delay_to;
				
				console.log({
						client_id: client_id,
						channel: channel,
						info: info,
						messages: {
								follower: {
										message: fol_message,
										outputting: getfol
									},
								subscriber: {
										message: sub_message,
										outputting: getfol
									},
								both: {
										message: both_message,
										outputting: getfol
									}
							},
						delay: delay,
						delaytimeout: delaytimeout
					});
				
				g();
				if(!delaytimeout) setInterval(g, delay);
			}
			else {
				console.error('Please set up the configuration file so that either the follower/subscriber count variable is in the message or "info" is either "fol", "sub", or "both"');
				setTimeout('', 10000);
			}
	}
	else {
		console.error('Improper config. Check for errors in the JSON like missing elements and empty strings. You can delete your config.json and rerun the script to recreate a correctly formatted configuration file.');
		setTimeout('', 10000);
	}

}
else fs.writeFile('config.json',
		prettyJSON({
			__comment:			'Visit the repository on GitHub for documentation: github.com/AlcaDesign/Twitch-Follower-And-Subscriber-Count/',
			client_id:			'asdf123asdf123asdf123asdf123asd',
			oauth_token:		'123asdf123asdf123asdf123asdf123',
			channel:			'channelname',
			info:				'followers',
			message_args:		['%CHANNEL%', '%FOLLOWER_COUNT%', '%SUBSCRIBER_COUNT%', '%LAST_FOLLOWER%', '%LAST_SUBSCRIBER%', '%RAW_JSON%'],
			follower_message:	'%FOLLOWER_COUNT% followers. Last follower: %LAST_FOLLOWER%',
			subscriber_message:	'%SUBSCRIBER_COUNT% subscribers. Last subscriber: %LAST_SUBSCRIBER%',
			both_message:		'%FOLLOWER_COUNT% followers and %SUBSCRIBER_COUNT% subscribers.',
			delay_sec:			5,
			delay_to:			false
	}), function() {
			console.error('No config file found. Created one.');
			setTimeout('', 3000);
	});
