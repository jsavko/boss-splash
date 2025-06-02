
Hooks.once("init", async function () {
    console.log('Boss Splash init - Registrering Socket')
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

    game.settings.register("boss-splash", "subColorFont", {
        name: "SETTINGS.BossSplashSubColorFont",
        hint: "SETTINGS.BossSplashSubColorFontHint",
        scope: "world",
        type: String,
        default: '#ffffff',
        config: true
    }); 

    game.settings.register("boss-splash", "subColorShadow", {
        name: "SETTINGS.BossSplashSubColorShadow",
        hint: "SETTINGS.BossSplashSubColorShadowHint",
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

    game.settings.register("boss-splash", "subFontSize", {
        name: "SETTINGS.BossSplashSubFontSize",
        hint: "SETTINGS.BossSplashSubFontSizeHint",
        scope: "world",
        default: "30px",
        config: true,
        type: String,
    });

    game.settings.register("boss-splash", "splashMessage", {
        name: "SETTINGS.BossSplashMessage",
        hint: "SETTINGS.BossSplashMessageHint",
        scope: "world",
        default: "{{actor.name}}",
        config: true,
        type: String,
      
    });

    game.settings.register("boss-splash", "subText", {
        name: "SETTINGS.BossSplashSubText",
        hint: "SETTINGS.BossSplashSubTextHint",
        scope: "world",
        default: "",
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

    game.settings.register("boss-splash", "animationDelay", {
        name: "SETTINGS.BossSplashAnimationDelay",
        hint: "SETTINGS.BossSplashAnimationDelayHint",
        scope: "world",
        default: 0,
        config: true,
        type: Number,
    });

    game.settings.register("boss-splash", "showTokenHUD", {
        name: "SETTINGS.BossSplashTokenHUD",
        hint: "SETTINGS.BossSplashTokenHUDHint",
        scope: "world",
        default: true,
        config: true,
        type: Boolean,
    });


});


// Helper function to create and insert a color input
function insertColorPicker(el, name, value) {
  const target = el.querySelector(`[name="${name}"]`);
  if (target && target.parentElement) {
    const input = document.createElement("input");
    input.type = "color";
    input.value = value;
    input.setAttribute("data-edit", name);
    target.parentElement.appendChild(input);
  }
}


Hooks.on('renderSettingsConfig', (app, el, data) => {
    // Insert color picker input
    insertColorPicker(el, "boss-splash.colorFirst", game.settings.get("boss-splash", "colorFirst"));
    insertColorPicker(el, "boss-splash.colorSecond", game.settings.get("boss-splash", "colorSecond"));
    insertColorPicker(el, "boss-splash.colorThird", game.settings.get("boss-splash", "colorThird"));
    insertColorPicker(el, "boss-splash.colorFont", game.settings.get("boss-splash", "colorFont"));
    insertColorPicker(el, "boss-splash.colorShadow", game.settings.get("boss-splash", "colorShadow"));
    insertColorPicker(el, "boss-splash.subColorFont", game.settings.get("boss-splash", "subColorFont"));
    insertColorPicker(el, "boss-splash.subColorShadow", game.settings.get("boss-splash", "subColorShadow"));

    //Render fonts
   let fontList =  FontConfig.getAvailableFontChoices();
   const selectedFont = game.settings.get('boss-splash','fontFamily')
   const fontSelect = el.querySelector('[name="boss-splash.fontFamily"]');
   
   for(const font in fontList){
        let setSelected = false;
        if (selectedFont == fontList[font]) setSelected = true;
        let o = new Option(fontList[font], font, setSelected, setSelected);
        fontSelect.appendChild(o);
    }
});

Hooks.on('renderTokenHUD', (app, html, context) => { 
    if ( game.user.role >= game.settings.get("boss-splash", "permissions-emit") && game.settings.get("boss-splash", "showTokenHUD")) {
        const token = app?.object?.document; 

        const button = document.createElement("div");
        button.className = "control-icon boss-splash";
        button.title = "Splash Boss";

        const icon = document.createElement("i");
        icon.className = "fa-solid fa-bullhorn";
        button.appendChild(icon);

        // Add event listener
        button.addEventListener("mouseup", () => {
            game.bossSplash.splashBoss();
        });

        // `Find` the left column and append the button
        const column = html.querySelector(".col.left");
        if (column) {
        column.appendChild(button);
        }

    }
});



Hooks.on('getActorContextOptions', (html, options)=>{
    if ( game.user.role >= game.settings.get("boss-splash", "permissions-emit")) {
        options.push(
            {
              "name": `Splash Boss`,
              "icon": `<i class="fa-solid fa-bullhorn"></i>`,
              "element": {},
              callback: li => {
                const selectedActor = li.dataset.documentId ?? li.dataset.entryId;
                splashBoss({actor: selectedActor})
              }
            }
          )
    }
});


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
            options.tokenName = canvas.tokens.controlled[0]?.name;
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
    let overlayDelay = options.animationDelay ?? game.settings.get('boss-splash','animationDelay');
    
    const delayOverlayTimer = setTimeout(async function(){
        overlay.render(true);
        game.bossSplash.currentOverlay = overlay;

        // Timer to remove the overlay
        let timerLength = options.timer ?? game.settings.get('boss-splash','splashTimer') * 1000

        if (timerLength > 0){
            //Close overlay after delay
            setTimeout(async function() {
                    await overlay.close({force:true})
            }, timerLength);
       }

    }, overlayDelay)

    const sound = options.sound ?? game.settings.get('boss-splash','bossSound');
    
    if(!!sound) {
        foundry.audio.AudioHelper.play({
            src: sound,
            volume: game.settings.get("core", "globalInterfaceVolume"),
            autoplay: true,
            loop: false
        }, true);
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
        return foundry.utils.mergeObject(super.defaultOptions, {
            ...super.defaultOptions,
            id: "boss-splash-overlay",
            popOut: false,
            classes: ["bossplash"],
            template: 'modules/boss-splash/templates/boss-splash.hbs',
            actor:null,
            token:null,
            sound:null, 
            colorFirst: null,
            colorSecond: null,
            colorThird: null,
            colorFont: null,
            subColorFont: null,
            colorShadow: null,
            subColorShadow: null,
            actorImg: null,
            message: null,
            subText: null,
            animationDuration: null,
            animationDelay: null,
            fontFamily: null,
            fontSize: null,
            subFontSize: null,
            video: null,
            fill: false
        });
    }

    

    async getData(options={}) {
        const context = super.getData(options);
        context.actor = this.options.actor ?? null;
        context.token = this.options.token ?? null;
        context.tokenName = this.options.tokenName ?? null;
        context.colorFirst = this.options.colorFirst ?? game.settings.get('boss-splash','colorFirst');
        context.colorSecond = this.options.colorSecond ?? game.settings.get('boss-splash','colorSecond');
        context.colorThird = this.options.colorThird ?? game.settings.get('boss-splash','colorThird');
        context.colorFont = this.options.colorFont ?? game.settings.get('boss-splash','colorFont');
        context.subColorFont  = this.options.subColorFont ?? game.settings.get('boss-splash','subColorFont');
        context.colorShadow = this.options.colorShadow ?? game.settings.get('boss-splash','colorShadow');
        context.subColorShadow = this.options.subColorShadow ?? game.settings.get('boss-splash','subColorShadow');
        context.sound = this.options.sound ?? game.settings.get('boss-splash','bossSound');
        let actor = game.actors.get(context.actor)
        context.message = this.options.message ?? game.settings.get('boss-splash','splashMessage');
        context.subText = this.options.subText ?? game.settings.get('boss-splash','subText');

        if (actor) { 
            context.message = context.message.replace('{{name}}', actor.name);
            context.message = context.message.replace('{{token.name}}', options.tokenName)
            context.actorImg = this.options.actorImg ?? actor.img;
            context.subText = context.subText.replace('{{token.name}}', options.tokenName);
            context.message = Handlebars.compile(context.message)({actor: actor});
            context.subText = Handlebars.compile(context.subText)({actor: actor});

        } else { 
            context.actorImg = this.options.actorImg
        }
        context.animationDuration = this.options.animationDuration ?? game.settings.get('boss-splash','animationDuration');
        context.animationDelay = this.options.animationDelay ?? game.settings.get('boss-splash','animationDelay');
        context.fontFamily = this.options.fontFamily ?? game.settings.get('boss-splash','fontFamily');
        context.fontSize = this.options.fontSize ?? game.settings.get('boss-splash','fontSize');
        context.subFontSize = this.options.subFontSize ?? game.settings.get('boss-splash','subFontSize');
        context.video = this.options.video;
        context.fill = this.options.fill;
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