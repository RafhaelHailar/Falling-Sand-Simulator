import p5 from "p5";

class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

const GRID_ROWS = 500;
const GRID_COLS = 500;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const GRID_WIDTH = CANVAS_WIDTH / GRID_COLS;
const GRID_HEIGHT =  CANVAS_HEIGHT / GRID_ROWS;
const sands: Vector2[] = [];
const scene = (new Array(GRID_ROWS).fill(0)).map(() => new Array(GRID_COLS).fill(0));

const sketch = (p: p5) => {
    function drawScene() {
        /* scene.forEach((row,y) => {
            row.forEach((cell,x) => {
                if (cell) p.fill("#629584");
                else p.fill("#387478");
                p.rect(x * GRID_WIDTH,y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
            });
        }) */
        sands.forEach((sand) => {
            const {x,y} = sand;
            p.noStroke();
            p.fill("#629584");
            p.rect(x * GRID_WIDTH,y * GRID_HEIGHT, GRID_WIDTH, GRID_HEIGHT);
        })
    }   
    
    function dropSand(sand: Vector2) {
        const {x,y} = sand;
        if (y === GRID_ROWS - 1) return;
        const below = scene[y + 1][x];
        const belowRight = scene[y + 1][x + 1];
        const belowLeft = scene[y + 1][x - 1];
        let dir = Math.sign((p.random() * 1) - 0.5);
       
        if (belowLeft && belowRight) dir = 0;
        else {
            if (belowLeft) dir = 1;
            if (belowRight) dir = -1;
        }
    
        if (!below) {
            scene[y][x] = 0;
            scene[y + 1][x] = 1;
            sand.y = y + 1;
            return;
        }
    
        if (dir === 1) {
            scene[y][x] = 0;
            scene[y + 1][x + 1] = 1;
            sand.y = y + 1;
            sand.x = x + 1;
            return;
        } else if (dir === -1) {
            scene[y][x] = 0;
            scene[y + 1][x - 1] = 1;
            sand.y = y + 1;
            sand.x = x - 1;
            return;
        }
    }
    
    function createSand(v: Vector2) {
        const {x,y} = v;
        if (y < 0 || y > GRID_ROWS - 1) return;
        if ((scene[y][x]) ||
            (scene[y][x] === undefined || scene[y][x] === null)) return;
        scene[y][x] = 1; 
        sands.push(v);
    }
    
    function updateScene() {
        sands.forEach(sand => {
           dropSand(sand);
        })
    }
    
    p.setup = () => {
        createSand(new Vector2(1,1));
        const c = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    };

    p.mouseDragged = (() => {
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            const x = p.floor(p.mouseX / GRID_WIDTH);
            const y = p.floor(p.mouseY / GRID_HEIGHT);
            const s = 100;
            const matrix = (new Array(s).fill(0)).map(() => new Array(s).fill(1));
            const c = Math.floor(s / 2);
            for (let i = 0;i < matrix.length;i++) {
                for (let j = 0;j < matrix[i].length;j++) {
                    let ax = i - c;
                    let ay = j - c;
                    createSand(new Vector2(x + ax, y + ay));
                }
            }
        }
    })

    p.draw = () => {
        p.background("#387478");
        updateScene();
        drawScene();
    };
};

new p5(sketch);
