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
game.bossSplash.splashBoss({
  actor: id,
  sound: path,
  colorFirst: hexColor,
  colorSecond:hexColor,
  colorThird: hexColor,
  colorFont: hexColor,
  colorShadow: hexColor,
  timer: number miliseconds})
  ```