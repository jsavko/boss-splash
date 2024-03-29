Hooks.once("i18nInit", async function () {
    console.log('Boss Splash Ready - Registrering Socket')
    game.socket.on("module.boss-splash", (data) => {
        displayBossOverlay(data);
    })

    game.bossSplash = { 
        splashBoss: splashBoss,
        emiteBoss: splashBoss,
        bossOverlay: BossSplashOverlay,
        currentOverlay: null
}

    //Register settings

    const permissionLevels = [
        game.i18n.localize("SETTINGS.BossSplashPermission.Player"),
        game.i18n.localize("SETTINGS.BossSplashPermission.Trusted"),
        game.i18n.localize("SETTINGS.BossSplashPermission.Assistant"),
        game.i18n.localize("SETTINGS.BossSplashPermission.GM")
    ];
    
    game.settings.register("boss-splash", "permissions-emit", {
        name: "SETTINGS.BossSplashPermission.Title",
        hint: "SETTINGS.BossSplashPermission.TitleHint",
        scope: "world",
        config: true,
        default: 3,
        type: Number,
        choices: permissionLevels,
        onChange: debouncedReload
    });

    game.settings.register("boss-splash", "colorFirst", {
        name: "SETTINGS.BossSplashColorFirst",
        hint: "SETTINGS.BossSplashColorFirstHint",
        scope: "world",
        type: String,
        default: '#ffd502',
        config: true
    });

    game.settings.register("boss-splash", "colorFirst", {
        name: "SETTINGS.BossSplashColorFirst",
        hint: "SETTINGS.BossSplashColorFirstHint",
        scope: "world",
        type: String,
        default: '#ffd502',
        config: true
    });

    game.settings.register("boss-splash", "colorSecond", {
        name: "SETTINGS.BossSplashColorSecond",
        hint: "SETTINGS.BossSplashColorSecondHint",
        scope: "world",
        type: String,
        default: '#ff8400',
        config: true
    });

    game.settings.register("boss-splash", "colorThird", {
        name: "SETTINGS.BossSplashColorThird",
        hint: "SETTINGS.BossSplashColorThirdHint",
        scope: "world",
        type: String,
        default: '#ff1f9c',
        config: true
    });

    game.settings.register("boss-splash", "colorFont", {
        name: "SETTINGS.BossSplashColorFont",
        hint: "SETTINGS.BossSplashColorFontHint",
        scope: "world",
        type: String,
        default: '#ffffff',
        config: true
    });

    game.settings.register("boss-splash", "colorShadow", {
        name: "SETTINGS.BossSplashColorShadow",
        hint: "SETTINGS.BossSplashColorShadowHint",
        scope: "world",
        type: String,
        default: '#000000',
        config: true
    });

    game.settings.register("boss-splash", "bossSound", {
        name: "SETTINGS.BossSplashSound",
        hint: "SETTINGS.BossSplashSoundHint",
        scope: "world",
        default: null,
        config: true,
        type: String,
        filePicker: "audio",
      
    });

    game.settings.register("boss-splash", "fontFamily", {
        name: "SETTINGS.BossSplashFont",
        hint: "SETTINGS.BossSplashFontHint",
        scope: "world",
        default: "Arial",
        config: true,
        type: String,
        choices: FontConfig.getAvailableFontChoices()
    });

    
    game.settings.register("boss-splash", "fontSize", {
        name: "SETTINGS.BossSplashFontSize",
        hint: "SETTINGS.BossSplashFontSizeHint",
        scope: "world",
        default: "100px",
        config: true,
        type: String,
    });

    game.settings.register("boss-splash", "splashMessage", {
        name: "SETTINGS.BossSplashMessage",
        hint: "SETTINGS.BossSplashMessageHint",
        scope: "world",
        default: "{{name}}",
        config: true,
        type: String,
      
    });

    game.settings.register("boss-splash", "splashTimer", {
        name: "SETTINGS.BossSplashTimer",
        hint: "SETTINGS.BossSplashTimerHint",
        scope: "world",
        default: 5,
        config: true,
        type: Number,
      
    });
    game.settings.register("boss-splash", "animationDuration", {
        name: "SETTINGS.BossSplashAnimationDuration",
        hint: "SETTINGS.BossSplashAnimationDurationHint",
        scope: "world",
        default: 3,
        config: true,
        type: Number,
      
    });



});

Hooks.on('renderSettingsConfig', (app, el, data) => {
    // Insert color picker input
    el.find('[name="boss-splash.colorFirst"]').parent()
      .append(`<input type="color" value="${game.settings.get('boss-splash','colorFirst')}" data-edit="boss-splash.colorFirst">`)

      el.find('[name="boss-splash.colorSecond"]').parent()
    .append(`<input type="color" value="${game.settings.get('boss-splash','colorSecond')}" data-edit="boss-splash.colorSecond">`)

    el.find('[name="boss-splash.colorThird"]').parent()
      .append(`<input type="color" value="${game.settings.get('boss-splash','colorThird')}" data-edit="boss-splash.colorThird">`)
    
    el.find('[name="boss-splash.colorFont"]').parent()
      .append(`<input type="color" value="${game.settings.get('boss-splash','colorFont')}" data-edit="boss-splash.colorFont">`)

      el.find('[name="boss-splash.colorShadow"]').parent()
      .append(`<input type="color" value="${game.settings.get('boss-splash','colorShadow')}" data-edit="boss-splash.colorShadow">`)


});

Hooks.on('renderTokenHUD', (app, html, context) => { 
    if ( game.user.role >= game.settings.get("boss-splash", "permissions-emit")) {
        const token = app?.object?.document; 
        const button = $(`<div class="control-icon boss-splash" title="Splash Boss"><i class="fa-solid fa-bullhorn"></i></div>`);
        button.on('mouseup', () => { 
            game.bossSplash.splashBoss()
        } );
        const column = '.col.left';
        html.find(column).append(button);
    }
});



Hooks.on('getActorDirectoryEntryContext', (html, options)=>{
    if ( game.user.role >= game.settings.get("boss-splash", "permissions-emit")) {
        options.push(
            {
              "name": `Splash Boss`,
              "icon": `<i class="fa-solid fa-bullhorn"></i>`,
              "element": {},
              callback: li => {
                splashBoss({actor: li.data("documentId")})
              }
            }
          )
    }
  })


    async function splashBoss(options={}) {
        //if (!game.user.isGM) {
        if ( game.user.role <= game.settings.get("boss-splash", "permissions-emit")) { 
            ui.notifications.warn(game.i18n.localize("BossSplash.ErrorGM"));
            return;
        }

        let validOptions = false
        options.sound  = options.sound ?? null;

        if (options.actor) { 
            validOptions = true;
        } else if (options.video) {
            validOptions = true;
        } else if (options.close) { 
            validOptions = true;
        } else if (options.message && options.actorImg) { 
            validOptions = true;
        } else if ( canvas.tokens.controlled.length) {
            options.actor = canvas.tokens.controlled[0]?.document.actorId;
            validOptions = true;
        } 

        if ((!validOptions) && game.user.isGM) {
            ui.notifications.warn(game.i18n.localize("BossSplash.ErrorToken"));
            return;
        }
        await game.socket.emit("module.boss-splash", options);
        //display for yourself
        displayBossOverlay(options);
    }  


function displayBossOverlay(options={}) { 

    if (options.close) {
        if(game.bossSplash.currentOverlay){ 
            game.bossSplash.currentOverlay.close({force:true})
        }
        return
    }

    if (game.bossSplash.currentOverlay) {
        if (game.user.isGM){ 
            ui.notifications.warn(game.i18n.localize("BossSplash.ErrorCount"));
        }
        return
    }
    let overlay = new game.bossSplash.bossOverlay(options);
    overlay.render(true);
    game.bossSplash.currentOverlay = overlay;

    const sound = options.sound ?? game.settings.get('boss-splash','bossSound');

    if(!!sound) {
        AudioHelper.play({
            src: sound,
            volume: 0.5,
            autoplay: true,
            loop: false
        }, true);
    }

    //
    let timerLength = options.timer ?? game.settings.get('boss-splash','splashTimer') * 1000

    if (timerLength > 0){
        //Close overlay after delay
        setTimeout(async function() {
                await overlay.close({force:true})
        }, timerLength);
   }
    
}

    
export class BossSplashOverlay extends Application {

    constructor(...args) {
        if(args[0].video) {
            args[0].template = "modules/boss-splash/templates/boss-splash-video.hbs"
        }
        super(...args);
    }

    /**
     * Debounce and slightly delayed request to re-render this panel. Necessary for situations where it is not possible
     * to properly wait for promises to resolve before refreshing the UI.
     */
    refresh = foundry.utils.debounce(this.render, 100);

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            ...super.defaultOptions,
            id: "boss-splash-overlay",
            popOut: false,
            classes: ["bossplash"],
            template: 'modules/boss-splash/templates/boss-splash.hbs',
            actor:null,
            sound:null, 
            colorFirst: null,
            colorSecond: null,
            colorThird: null,
            colorFont: null,
            colorShadow: null,
            actorImg: null,
            message: null,
            animationDuration: null,
            fontFamily: null,
            fontSize: null,
            video: null,
            fill: false
        });
    }

    

    async getData(options={}) {
        const context = super.getData(options);
        context.actor = this.options.actor ?? null;
        context.colorFirst = this.options.colorFirst ?? game.settings.get('boss-splash','colorFirst');
        context.colorSecond = this.options.colorSecond ?? game.settings.get('boss-splash','colorSecond');
        context.colorThird = this.options.colorThird ?? game.settings.get('boss-splash','colorThird');
        context.colorFont = this.options.colorFont ?? game.settings.get('boss-splash','colorFont');
        context.colorShadow = this.options.colorShadow ?? game.settings.get('boss-splash','colorShadow');
        context.sound = this.options.sound ?? game.settings.get('boss-splash','bossSound');
        let actor = game.actors.get(context.actor)
        context.message = this.options.message ?? game.settings.get('boss-splash','splashMessage');
        if (actor) { 
            context.message = context.message.replace('{{name}}', actor.name);
            context.actorImg = this.options.actorImg ?? actor.img;
        } else { 
            context.actorImg = this.options.actorImg
        }
        context.animationDuration = this.options.animationDuration ?? game.settings.get('boss-splash','animationDuration');
        context.fontFamily = this.options.fontFamily ?? game.settings.get('boss-splash','fontFamily');
        context.fontSize = this.options.fontSize ?? game.settings.get('boss-splash','fontSize');
        context.video = this.options.video;
        context.fill = this.options.fill;
        //console.log(context)
        return context;
    }    

    get actor() {
        return this.token?.actor ?? game.user?.character ?? null;
    }


    async refresh(force) {
        return foundry.utils.debounce(this.render.bind(this, force), 100)();
    }

    async close(options) { 
        super.close(options);
        game.bossSplash.currentOverlay = null;
    }

    activateListeners(html) {
        super.activateListeners(html);
      }

}