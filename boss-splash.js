Hooks.once("init", async function () {
    console.log('Boss Splash Init - Registrering Socket')
    game.socket.on("module.boss-splash", (data) => {
        displayBossOverlay(data);
    })

    game.bossSplash = { 
        splashBoss: splashBoss,
        emiteBoss: splashBoss,
        bossOverlay: BossSplashOverlay
}

    //Register settings
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
    if (game.user.isGM) {
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
    if (game.user.isGM) { 
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
        if (!game.user.isGM) {
            ui.notifications.warn("You must be a GM to use this command.");
            return;
        }

        let validOptions = false
        options.sound  = options.sound ?? null;

        if (options.actor) { 
            validOptions = true;
        } else if (options.message && options.actorImg) { 
            validOptions = true;
        } else if ( canvas.tokens.controlled.length) {
            options.actor = canvas.tokens.controlled[0]?.document.actorId;
            validOptions = true;
        } 

        if ((!validOptions) && game.user.isGM) {
            ui.notifications.warn("Please select a character token.");
            return;
        }
        await game.socket.emit("module.boss-splash", options);
        //display for yourself
        displayBossOverlay(options);
    }  


function displayBossOverlay(options={}) { 
    let overlay = new game.bossSplash.bossOverlay(options);
    overlay.render(true);

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


    setTimeout(function() {
        overlay.close({force:true})
    }, timerLength);
    
}

    
export class BossSplashOverlay extends Application {

    constructor(...args) {
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
            template: "modules/boss-splash/templates/boss-splash.hbs",
            actor:null,
            sound:null, 
            colorFirst: null,
            colorSecond: null,
            colorThird: null,
            colorFont: null,
            colorShadow: null,
            actorImg: null,
            message: null,
            animationDuration: null
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
        }
        context.actorImg = this.options.actorImg ?? actor.img;
        context.animationDuration = this.options.animationDuration ?? game.settings.get('boss-splash','animationDuration');

        return context;
    }    

    get actor() {
        return this.token?.actor ?? game.user?.character ?? null;
    }


    async refresh(force) {
        return foundry.utils.debounce(this.render.bind(this, force), 100)();
    }

    activateListeners(html) {
        super.activateListeners(html);
        //html.find('[name=actorImg]').animate({left: '825px'}, 5000);
        //html.find('[name=bossMessage]').animate({left: '50px'}, 5000);
      }

}