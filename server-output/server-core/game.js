
export const GameState = Object.freeze({
    EDIT: 'edit',
    PLAY: 'play'
})

export function createGame() {
    let game = {
        state: GameState.EDIT,
        players: [] // maybe switch to set or map
    }
    return game;
}