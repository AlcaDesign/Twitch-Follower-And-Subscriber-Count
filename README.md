Twitch Followers and Subscribers
================================

Retrieves follower and/or subscriber information from the Twitch API and saves it to a file in a format set by the user in a configuration file.


##Setup

###Prerequisites
* Joyent Node.js&reg;
* A Twitch account
    * Client ID from a registered application
    * An OAuth token if you want access to subscription data (optional)

###Instructions

####Install Node.js&reg;

1. Go to [the Node.js&reg; download page](http://nodejs.org/download/) and download the version for your system.
1. Install Node.js&reg; for your system.

####Download the code

* Saving the source code
   1. Click `followers.js` in the file navigator on GitHub to display the source code.
   1. Click "Raw" in the grey box above the code.
   1. Save this page (Ctrl+S or right-click "Save as...")
   1. Place it in a folder where OBS or some other program can read the resulting file "followers.txt"

####Run `followers.js`

You have severals options to run the file. Choose from below.

Once you have run the program once, it should create a configuration file called "config.json." As you can tell, it's written in [JSON](http://json.org/). There's another section about editing the configuration file below.

#####Directly into a command prompt/terminal

The basic way would be to open a command prompt/terminal and `cd` to the location of `followers.js` and run using `node`:
```
$ cd followers
$ node followers.js
```

#####Folder Address Bar

If you have the folder open in Windows, you can press alt+d (to select the text for the current folder's address) and type "`cmd`" to open a command prompt or simply "`node followers.js`" to automatically run the file.

#####Shortcut to batch file (Windows)

You can create a `.bat` file in the same folder with `follower.js` and write the following:
`
node followers.js
pause
`
Then you can either run this file or create a shortcut in some other folder or pin it to your Start menu (or similar)

#####Associate Node with `.js`

######Windows

* Context menu:
    1. Right-click `followers.js` and choose "Open with" -> "Choose default program..."
    1. Select Node. Node.js&reg; will appear as a green hexagon labeled as "Evented I/O for V8 JavaScript" by "Joyent, Inc."
* Use the control panel:
    1. Open the file association helper in the control panel:
        1. Windows 7 and probably 8: Open the start menu and type "asso" and press enter. This will open the control panel to the "Set Associations" helper.
        1. Otherwise, open the Windows control panel and:
            1. Click Programs.
            1. Click "Make a file type always open in a specific program" or similar.
    1. Then scroll to file ".js" on the left and double click the line or click "Change program..." near the top right-hand corner of the window.
    1. Select Node. Node.js&reg; will appear as a green hexagon labeled as "Evented I/O for V8 JavaScript" by "Joyent, Inc."
    1. Hit OK to close the dialog and Close to exit the control panel.

######Mac

1. Right-click `followers.js` and choose "Get info."
1. Change "Open with" to Node.js&reg; or however it appears on Mac.

######Linux

1. Right-click `followers.js` and choose "Properties."
1. Go to the "Open with" tab and select Node.js&reg; or however it appears on Mac.

---
####Modify The Configuration File

The file is formatted in [JSON](http://json.org/). There are plenty of online converters and documentation if you need fundamental help working with this file.

* "**client_id**" - String - This is the client ID of a Twitch application you must create for the purpose of this application to [prevent the Twitch API from rate limiting you](https://github.com/justintv/twitch-api#rate-limits).
* "**channel**" - String - The channel you want to access information for.
* "**message_args**" - Array - This is merely a list of variables used in the message and changing or removing this does not affect the program.
* "**message**" - String - What you want written to followers.txt by the program. You can use the variables in `message_args` to input infomation into your message.
    1. "**%COUNT%**" - The `channel`'s current number of followers as reported by the Twitch API.
    1. "**%CHANNEL%**" - The `channel` that it's checking for written exactly as it is in the config.
    1. "**%LAST_FOLLOWER%**" - The `display_name` of the last follower.
    1. "**%LAST_SUBSCRIBER%**" - The `display_name` of the last subscriber.
    1. "**%RAW_JSON%**" - The raw output from the Twitch API.
* "**delay_sec**" - Number - Number of seconds to wait between requests to the Twitch API. `5` is the default value.
* "**delay_to**" - Boolean - Can be ``true`` or `false`. `false` is the default value. This tells the program to send a request every `delay_sec` seconds (false) or `delay_sec` after the last request to the Twitch API (true). ("to" means timeout like setTimeout)

####Twitch Application Registration And Retrieving The Client ID
You may use an application you've already registered for the purpose of obtaining a client ID.

1. Go to [Twitch.tv](http://twitch.tv) and log in to your account.
1. Go to the [settings](http://www.twitch.tv/settings).
1. Go to the [Connections](http://www.twitch.tv/settings/connections) tab.
1. At the bottom, click "[Register your application](http://www.twitch.tv/kraken/oauth2/clients/new)."
1. Enter an application name like "Follow Count" and "http://localhost" for the "Redirect URI."
1. Copy the client ID from the resulting page into the `config.json` file.

```javascript
"client_id": "*insert ID here*",
```
