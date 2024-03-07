Hooks.once("init", async function () {
    console.log('Boss Splash Init - Registrering Socket')
    game.socket.on("module.boss-splash", (data) => {
        displayBossOverlay(data.actor);
    })

    game.bossSplash = { 
        emiteBoss: async function () {
            if (!game.user.isGM) {
                ui.notifications.warn("You must be a GM to use this command.");
                return;
            }
            if (canvas.tokens.controlled.length == 0 && game.user.isGM) {
                ui.notifications.warn("Please select a character token.");
                return;
            }
            await game.socket.emit("module.boss-splash", {actor: canvas.tokens.controlled[0].document.actorId});
            //display for yourself
            displayBossOverlay(canvas.tokens.controlled[0].document.actorId);

        },
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

    let sounds = 
    game.settings.register("boss-splash", "bossSound", {
        name: "SETTINGS.BossSplashSound",
        hint: "SETTINGS.BossSplashSoundHint",
        scope: "world",
        default: null,
        config: true,
        type: String,
        filePicker: "audio",
      
    });


});

Hooks.on('renderSettingsConfig', (app, el, data) => {
    // Insert color picker input
    el.find('[name="boss-splash.colorFirst"]').parent()
      .append(`<input type="color" value="${game.settings.get('boss-splash','colorFirst')}" data-edit="boss-splash.colorFirst">`)
    // Insert preview icon
    el.find('[data-tab="favorite-items"] h2')
      .append(` - <i class="favorite-preview fa-solid ${game.settings.get('boss-splash','colorFirst')}" style="color: ${game.settings.get('boss-splash','colorFirst')}"></i>`)//.css({'color':'red'})

          // Insert color picker input
    el.find('[name="boss-splash.colorSecond"]').parent()
    .append(`<input type="color" value="${game.settings.get('boss-splash','colorSecond')}" data-edit="boss-splash.colorSecond">`)
    // Insert preview icon
    el.find('[data-tab="favorite-items"] h2')
    .append(` - <i class="favorite-preview fa-solid ${game.settings.get('boss-splash','colorSecond')}" style="color: ${game.settings.get('boss-splash','colorSecond')}"></i>`)//.css({'color':'red'})

        // Insert color picker input
    el.find('[name="boss-splash.colorThird"]').parent()
      .append(`<input type="color" value="${game.settings.get('boss-splash','colorThird')}" data-edit="boss-splash.colorThird">`)
    // Insert preview icon
    el.find('[data-tab="favorite-items"] h2')
      .append(` - <i class="favorite-preview fa-solid ${game.settings.get('boss-splash','colorThird')}" style="color: ${game.settings.get('boss-splash','colorThird')}"></i>`)//.css({'color':'red'})

    });


function displayBossOverlay(actor) { 
    let overlay = new game.bossSplash.bossOverlay({actor:actor})
    overlay.render(true);

    if(!!game.settings.get('boss-splash','bossSound')) {
        AudioHelper.play({
            src: game.settings.get('boss-splash','bossSound'),
            volume: 0.5,
            autoplay: true,
            loop: false
        }, true);
    }


    setTimeout(function() {
        overlay.close({force:true})
    }, 5000);
    
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
            colorThird: null
        });
    }


    async getData(options={}) {
        const context = super.getData(options);
        context.actor = this.options.actor ?? null;
        context.colorFirst = this.options.colorFirst ?? game.settings.get('boss-splash','colorFirst');
        context.colorSecond = this.options.colorSecond ?? game.settings.get('boss-splash','colorSecond');
        context.colorThird = this.options.colorThird ?? game.settings.get('boss-splash','colorThird');
        context.sound = this.options.sound ?? game.settings.get('boss-splash','bossSound');
        let actor = game.actors.get(context.actor)
        context.actorName = actor.name;
        context.actorImg = actor.img;

        return context;
    }    

    get actor() {
        return this.token?.actor ?? game.user?.character ?? null;
    }


    async refresh(force) {
        return foundry.utils.debounce(this.render.bind(this, force), 100)();
    }

}