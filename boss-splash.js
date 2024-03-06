Hooks.once("init", async function () {
    console.log('Boss Splash Init - Registrering Socket')
    game.socket.on("module.boss-splash", (data) => {
        let overlay = new game.bossSplash.bossOverlay({actor:data.actor})
        overlay.render(true)
        setTimeout(function() {
            overlay.close({force:true})
        }, 5000);



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
            let overlay = new game.bossSplash.bossOverlay({actor:canvas.tokens.controlled[0].document.actorId})
            overlay.render(true)

            setTimeout(function() {
                overlay.close({force:true})
            }, 5000);

        },
        bossOverlay: BossSplashOverlay
}


});




    
export class BossSplashOverlay extends Application {

    constructor(...args) {
        super(...args);

        //this.ConflictCaptain = false;
        //this._initialSidebarWidth = ui.sidebar.element.outerWidth();
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
            actor:null
        });
    }


    async getData(options={}) {
        const context = super.getData(options);
        context.actor = this.options.actor ?? null;
        let actor = game.actors.get(context.actor)
        context.actorName = actor.name;
        context.actorImg = actor.img;
        console.log(context)
        return context;
    }    

    get actor() {
        return this.token?.actor ?? game.user?.character ?? null;
    }


    async refresh(force) {
        return foundry.utils.debounce(this.render.bind(this, force), 100)();
    }

}