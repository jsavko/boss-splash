# Boss Splashscreen

A splash screen will be sent to all players that lasts 5 seconds

![image](https://github.com/jsavko/boss-splash/assets/192591/3adc43a2-9b31-4545-b582-edfeb87cd853)

Settings

![image](https://github.com/jsavko/boss-splash/assets/192591/788b1ca7-4f05-47b7-b2d3-458f5aa75fe3)

Activate the splash screen via 3 methods:

Token HUD

![image](https://github.com/jsavko/boss-splash/assets/192591/a10cd2c2-cb84-4399-ac86-343b7de26fb6)


Actor Directory Context Menu

![image](https://github.com/jsavko/boss-splash/assets/192591/f16c999e-eeb1-4982-81d7-d576ea41e00e)


Macro
```
/**
 * Displays a splash screen with the Actor Image and Text
 * Any options not included will use their default values from the module settings.
 * If options message and actorImg are both included you do not need a target actor of selected token.
    * @param {string} actor  id of actor.
    * @param {string} sound  Path to an audio file to be played when splash screen is rendered.
    * @param {string} colorFirst  Hex value for the color of the top bar in the banner.
    * @param {string} colorSecond  Hex value for the color of the middle bar in the banner.
    * @param {string} colorThird  Hex value for the color of the middle bar in the banner.
    * @param {string} colorFont  Hex value for the text color of the message.
    * @param {string} subColorFont  Hex value for the text color of the subText.
    * @param {string} colorShadow  Hex value for the drop shadow color of the message.
    * @param {string} subColorShadow  Hex value for the drop shadow color of the subText.
    * @param {string} message  The message to be rendered in the color bar. {{actor.name}} and {{token.name}} will be replaced with the appropate name
    * @param {string} subText  The sub message to be rendered in the second color bar.
    * @param {string} fontFamily Font Family name for the message.
    * @param {string} fontSize CSS accepted Size of font.
    * @param {string} subFontSize CSS accepted Size of font for subText.
    * @param {string} actorImg  Path to an image to display on the banner.
    * @param {number} timer  Number of miliseconds for splash screen to be rendered.
    * @param {number} animationDuration  Number of seconds to complete the slide in animation.
    * @param {number} animationDelay   Number of miliseconds to delay the animation
    * @param {string} video  Path to video file for splash screen.
    * @param {bool} fill  Stretch video to full screen. defaults false
    * @param {bool} close  Closes open overlay for all players.
    * 
 */

let options = {
  actor: null,
  sound: null,
  colorFirst: null,
  colorSecond:null,
  colorThird: null, 
  colorFont: null,
  subColorFont: null,
  colorShadow: null,
  subColorShadow: null,
  message: null, 
  subText: null,
  fontFamily: null,
  fontSize: null,
  subFontSize: null,
  actorImg: null,
  timer: null,
  animationDuration: null,
  animationDelay: null,
  video: null,
  fill: false,
  close: null 
};

game.bossSplash.splashBoss(options);
```

Examples

Splash currently selected Token's Actor 

```game.bossSplash.splashBoss()```

Splash A specific Actor 

```game.bossSplash.splashBoss({actor:"WNX5OQKPh4uaV7mW"})```

Splash the currently selected Token with all black bars

```game.bossSplash.splashBoss({colorFirst:"#000000",colorSecond:"#000000",colorThird:"#000000"})```

Splash specific art and message

```game.bossSplash.splashBoss({message:"Valeros The Mighty!", actorImg:"modules/pf2e-beginner-box/assets/portraits-heroes/iconics/valeros-2.webp"})```

Open boss splash with no dismisal timer 
```game.bossSplash.splashBoss({timer:0})```

Close all open splash screens for all players 
```game.bossSplash.splashBoss({close:true})```

Use a video splash 
```game.bossSplash.splashBoss({video:'/world/myworld/media/Ogre.mp4'})```