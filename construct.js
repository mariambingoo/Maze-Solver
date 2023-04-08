var columns;
var rows;
var w =40;
var grid = [];
var current;
var stack = [];
var stack_solve;
var counter = 0;
var drewMaze = false;
var solved = false;
var queue;
var curr;
var heap;
var isBFS = false;
var isDFS = false;
var isA = false;

function setup()
{
    createCanvas(600, 600); 
    columns = floor(width / w);
    rows = floor(height / w);
    for (var y= 0; y < rows; y++)
    {
        for (var x = 0; x < columns; x++)
        {
            var cell = new Cell(x, y);
            grid.push(cell);
        }
    }
    current = grid[0];
    curr = grid[0];
    curr.visited_solve = true;
    queue = [];
    stack_solve = [];
    heap = new MinHeap();
    queue.push(curr);
    heap.add(curr);
    stack_solve.push(curr);
    radio = createRadio();
    radio.option('1', 'Depth First Search');
    radio.option('2', 'Breadth First Search');
    radio.option('3', 'A*');
    radio.position(600, 680);
    radio.style('width', '3000px');
    radio.selected('1');
    solution = grid[(columns*rows) - 1];
}
function restart()
{
    console.log("restarted");
    for (var i = 0; i < grid.length; i++)
        {
            grid[i].drawL();
            grid[i].visited_solve = false;
            grid[i].isPath = false;
            grid[i].isSolve = false;
            grid[i].parent = null;
        }
    solved = false;
    curr = grid[0];
    queue = [];
    stack_solve = [];
    heap = new MinHeap();
    queue.push(curr);
    heap.add(curr);
    stack_solve.push(curr);
    solution = grid[(columns*rows) - 1];
}

function draw()
{
    background("#000000");
    drawMaze();
    if (drewMaze)
    {
        frameRate(20);
        if (radio.value() == 1)
        {
            if (isBFS || isA)
                {
                    restart();
                    isBFS = false;
                    isA = false;
                }
            solveDFS();
            isDFS = true;
        }
        else if (radio.value() == 2)
        {
            if (isDFS || isA)
                {
                    restart();
                    isDFS = false;
                    isA = false;
                }
            solveBFS();
            isBFS = true;
        }
        else if (radio.value() == 3)
        {
            if (isDFS || isBFS)
                {
                    restart();
                    isDFS = false;
                    isBFS = false;
                }
            solveA();
            isA = true;
        }
    }
    else
        frameRate(30);
    if (solved)
        drawPath();
}
function index(x, y)
{
    if (x < 0 || y < 0|| x > columns-1 || y > rows-1)
    {
        return -1;
        }
    return x + y *columns
} 

function Cell(x, y)
{
    this.walls = [true, true, true, true];
    this.x = x;
    this.y = y;
    this.parent;
    this.visited = false;
    this.visited_solve = false;
    this.isPath = false;
    this.isSolve = false;
    this.fCost;
    this.checkNeighbors = function ()
    {
        var neighbors = []
        var top = grid[index(x, y -1)];
        var right = grid[index(x+1, y )];
        var bottom = grid[index(x, y +1)];
        var left = grid[index(x - 1, y)];
        
        if (top && !top.visited)
            neighbors.push(top);
        if (right && !right.visited)
            neighbors.push(right); 
        if (bottom && !bottom.visited)
            neighbors.push(bottom);
        if (left && !left.visited)
            neighbors.push(left);
        
        if (neighbors.length > 0)
        {
            var r = floor(random(0, neighbors.length));
            return neighbors[r];
        }
        else
            return undefined;
    }
    this.checkNeighbors_solve = function ()
    {
        var neighbors = []
        var top = grid[index(x, y -1)];
        var right = grid[index(x+1, y )];
        var bottom = grid[index(x, y +1)];
        var left = grid[index(x - 1, y)];
        
        if (top && !top.visited_solve && !top.walls[2])
            neighbors.push(top);
        if (right && !right.visited_solve && !right.walls[3])
            neighbors.push(right); 
        if (bottom && !bottom.visited_solve && !bottom.walls[0])
            neighbors.push(bottom);
        if (left && !left.visited_solve && !left.walls[1])
            neighbors.push(left);
        
        if (neighbors.length > 0)
            return neighbors;
        else
            return undefined;
    }
    this.drawL = function ()

    {
        var i= this.x * w;
        var j = this.y * w;
            stroke(0);

        
        if (this.walls[0])
        {
            line(i, j, i + w, j);
        }
        if (this.walls[1])
        {
            line(i + w, j, i + w, j + w);
        }
        if (this.walls[2])
        {
            line(i + w, j + w, i, j + w);
        }
        if (this.walls[3])
        {
            
            line(i, j + w, i, j);
        } 
        if (this.visited)
        {
            noStroke();
            fill("#635985");
            rect(i, j, w, w);
        
        }

    }
    this.highlight = function()
    {
        var i = this.x * w;
        var j = this.y * w;
        noStroke();
        fill('#9E4784')
        rect(i,j,w,w)
    }
    this.setTarget = function()
    {
        var i = this.x * w;
        var j = this.y * w;
        noStroke();
        fill('#9E4784');
        rect(i, j, w, w);
    }
    this.setSolve = function()
    {
        var i = (this.x*w) + w/2;
        var j = (this.y*w) + w/2;
        noStroke();
        fill('#9E4784');
        circle(i, j, w/1.3);
    }
    this.setPath = function ()
    {
        var i = (this.x*w) + w/2;
        var j = (this.y*w) + w/2;
        noStroke();
        fill('#18122B'); 
        circle(i, j, w/1.4);
    }
    this.getFcost = function(starting, ending)
    {
        var distanceX = Math.abs(starting.x - ending.x);
        var distanceY = Math.abs(ending.y - ending.y);
        this.fCost = distanceX + distanceY;
    }
}


function removeWalls(a, b)
{
    var m = a.x - b.x;
    var n = a.y - b.y;
    if (m == -1)
    {
        a.walls[1] = false
        b.walls[3] = false
    } else if (m == 1)
    {
        a.walls[3] = false
        b.walls[1] = false
    }
    if (n == -1) {
        a.walls[2] = false
        b.walls[0] = false
    } else if (n == 1)
    {
        a.walls[0] = false
        b.walls[2] = false
    }

}

function drawMaze()
{
    for (var i = 0; i< grid.length; i++)
    {
        grid[i].drawL();
        if (grid[i].isPath)
            grid[i].setPath();
        if (grid[i].isSolve)
            grid[i].setSolve();
    }
    current.visited = true;
    current.highlight();
    var next = current.checkNeighbors();
    if (next)
    {
        next.visited = true;
        stack.push(current);
        removeWalls(current, next);
        current = next;
    } else if (stack.length > 0)
        {
            current = stack.pop();
            counter++
        }
    if (counter == grid.length-1)
        drewMaze = true;

}

function solveBFS()
{
    var target = grid[(columns*rows) - 1];
    target.setTarget();
    if (queue.length > 0 && !solved)
    {
        curr = queue.shift();
        if (target === curr)
        {
            solved = true;
        }
        curr.isPath = true;
        neighbors = curr.checkNeighbors_solve();
        if (neighbors)
        {
            for (let i=0; i < neighbors.length; i++)
            {
                queue.push(neighbors[i]);
                neighbors[i].visited_solve = true;
                neighbors[i].parent = curr;
            }
        }
    }
}
function solveDFS()
{
    var target = grid[(columns*rows) - 1];
    target.setTarget();
    if (stack_solve.length > 0 && !solved)
    {
        curr = stack_solve.pop();
        if (target === curr)
        {
            solved = true;
        }
        curr.isPath = true;
        neighbors = curr.checkNeighbors_solve();
        if (neighbors)
        {
            for (let i=0; i < neighbors.length; i++)
            {
                stack_solve.push(neighbors[i]);
                neighbors[i].visited_solve = true;
                neighbors[i].parent = curr;
            }
        }
    }
}

function solveA()
{
    var target = grid[(columns*rows) - 1];
    target.setTarget();
    if (stack_solve.length > 0 && !solved)
    {
        curr = heap.remove();
        if (target === curr)
            solved = true;

        curr.isPath = true;
        neighbors = curr.checkNeighbors_solve();
        if (neighbors)
        {
            for (let i=0; i < neighbors.length; i++)
            {
                neighbors[i].getFcost(grid[0], target)
                heap.add(neighbors[i])
                neighbors[i].visited_solve = true;
                neighbors[i].parent = curr;
            }
        }
    }
}

function drawPath()
{
    console.log("drawPath");
    if (solution !== grid[0])
    {
        solution = solution.parent;
        solution.isSolve = true;
        console.log("isSolve");
    }
}