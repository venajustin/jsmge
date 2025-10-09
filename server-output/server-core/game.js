
export const GameState = Object.freeze({
    EDIT: 'edit',
    PLAY: 'play'
})

export class Game {
        state = GameState.EDIT;
        active_scene = "testscene2.scene";
        players = []; // maybe switch to set or map


        running = true;
        stopGame() { this.running = false; }
        async start() {

            while (this.running) {

                await new Promise((resolve) => setTimeout(resolve,1000));
                console.log("Tick");


            }


        }





}
