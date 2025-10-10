
export const GameState = Object.freeze({
    EDIT: 'edit',
    PLAY: 'play'
})

export class Game {
        state = GameState.EDIT;
        active_scene = "testscene2.scene";
        players = []; // maybe switch to set or map


        running_instances = [];
        // only one instance should be running at a time
        // This system allows for game.start() to stop all other start() functions that are still running async
        stopGame() {
            for (let instance of this.running_instances) {
                instance.running = false;
            }
            this.running_instances.length = 0;
        }
        async start() {
            this.stopGame();
            const instance = { running: true };
            this.running_instances.push(instance);

            while (instance.running) {

                await new Promise((resolve) => setTimeout(resolve,1000));
                console.log("Tick");
                console.log(this.running_instances);


            }


        }





}
