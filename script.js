function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // Максимум не включается, минимум включается
}

const game = {
    score: 0,
    area: [],
    countOfCeils: 0,
    countOfCeilsInLine: 0,
    activeElement: null,
    start: false,
    steps: 0,

    fillData(score = 30, countOfCeils = 15) {
        this.score = score;
        this.countOfCeils = countOfCeils;

        countOfCeilsInLine = this.countOfCeilsInLine = Math.sqrt(
            this.countOfCeils
        );

        const area = this.area;

        for (let i = 0, k = 1; i < game.countOfCeilsInLine; i++) {
            game.area.push([]);

            for (let j = 0; j < game.countOfCeilsInLine; j++) {
                area[i].push({
                    active:
                        k < Math.pow(game.countOfCeilsInLine, 2) ? false : true,
                    value: k < Math.pow(game.countOfCeilsInLine, 2) ? k++ : 0,
                    neighbors: [
                        i - 1 >= 0 ? { y: i - 1, x: j } : null,
                        j + 1 < game.countOfCeilsInLine
                            ? { y: i, x: j + 1 }
                            : null,
                        i + 1 < game.countOfCeilsInLine
                            ? { y: i + 1, x: j }
                            : null,
                        j - 1 >= 0 ? { y: i, x: j - 1 } : null,
                    ],
                });

                if (area[i][j].active)
                    this.activeElement = { ...area[i][j], x: j, y: i };
            }
        }
    },

    isNeighbor(x, y) {
        const elNeighbors = this.activeElement.neighbors;
        let flag = false;

        elNeighbors.forEach((el) => {
            if (el && el.x == x && el.y == y) flag = true;
        });

        return flag;
    },

    print() {
        const gameContainer = document.getElementById('game');
        gameContainer.innerHTML = '';

        const table = document.createElement('table');

        game.area.forEach((row, y) => {
            const tr = document.createElement('tr');

            row.forEach((el, x) => {
                const td = document.createElement('td');
                const btn = document.createElement('button');

                btn.innerHTML = el.value;
                btn.disabled = !this.isNeighbor(x, y);

                btn.classList = 'game-button';
                this.isNeighbor(x, y)
                    ? btn.classList.add('game-button--active')
                    : btn.classList.remove('game-button--active');

                el.node = td;
                el.node.setAttribute(
                    'active',
                    this.activeElement.x == x && this.activeElement.y == y
                );
                el.node.setAttribute('x', x);
                el.node.setAttribute('y', y);

                td.append(btn);
                tr.append(td);
            });

            table.append(tr);
        });

        gameContainer.append(table);
    },

    play() {
        document.querySelectorAll('#game .game-button').forEach((btn) => {
            btn.onclick = () => {
                this.steps++;
                const x = btn.parentElement.getAttribute('x');
                const y = btn.parentElement.getAttribute('y');

                this.area[this.activeElement.y][this.activeElement.x].value =
                    this.area[y][x].value;
                this.area[y][x].value = this.activeElement.value;

                this.activeElement = { ...this.area[y][x], x, y };
                this.area.forEach((row) => {
                    row.forEach((el) => {
                        el.node.setAttribute('active', el.x == x && el.y == y);
                        el.node.querySelector('.game-button').innerHTML =
                            el.value;
                    });
                });

                this.print();
                this.play();
                this.check();
            };
        });

        if (!this.start) game.rand();
    },

    rand() {
        this.start = true;
        for (let i = 0; i < this.score; i++) {
            const btns = document.querySelectorAll(
                '#game .game-button--active'
            );

            const t = getRandomInt(0, btns.length);

            btns[t].click();
        }
    },

    check() {
        let flagCount = 0;
        this.area.forEach((row, i) => {
            row.forEach((el, j) => {
                const pos =
                    i * row.length + j + 1 < Math.pow(countOfCeilsInLine, 2)
                        ? i * row.length + j + 1
                        : 0;

                if (pos == el.value) flagCount++;
            });
        });

        if (
            this.steps > this.score &&
            flagCount == Math.pow(Math.ceil(countOfCeilsInLine), 2)
        ) {
            document.body.append(
                `Ты прошел уровень за ${this.steps - this.score} шагов.`
            );
            this.steps = 0;
            this.rand();
        }
    },
};

let level = 0;

while (level < 20 || level > 300) {
    level = prompt('Укажи уровень сложности от 20 до 300', 100);
}
game.fillData(level, 15);
game.print();
game.play();

console.log(game);
