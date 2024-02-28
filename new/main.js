const boxs = document.querySelectorAll('.box')

var gamePattern = [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
]

let playerActive = 1

// var winPattern = [
//     [0,1,2]
// ]

for (let i = 0; i < boxs.length; i++) {
    const box = boxs[i];
    const row = Math.floor(i / 3);
    const col = i % 3;
    box.addEventListener('click', e => {
        if (gamePattern[row][col] == undefined) {
            if (playerActive == 1) {
                playerActive = 0
            } else {
                playerActive = 1
            }

            gamePattern[row][col] = playerActive
            const player = document.createElement('h1')
            player.innerHTML = playerActive == 1 ? 'X' : 'O'

            box.append(player)
        }
        // if (
        //     (gamePattern[0][0] == 1 && gamePattern[0][1] && gamePattern[0][1]) ||
        //     (gamePattern[0][0] == 1 && gamePattern[0][1] && gamePattern[0][1]) ||
        // ) {

        // }
    })
}