
export const GameState = Object.freeze({
    EDIT: 'edit',
    PLAY: 'play'
})

export function createGame() {
    let game = {
        state: GameState.EDIT,
        active_scene: "",
        players: [] // maybe switch to set or map
    }
    return game;
}
