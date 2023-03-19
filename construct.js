var columns;
var rows;
var w = 60;
var grid = [];
var current;
var stack = [];
var counter = 0;
var drewMaze = false;
var solved = false;

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
    radio = createRadio();
    radio.option('1', 'Depth First Search');
    radio.option('2', 'Breadth First Search');
    radio.option('3', 'A*');
    radio.style('width', '3000px');
    radio.selected('2');
}

function draw()
{
    background("#1F8A70");
    drawMaze();
    if (drewMaze)
    {
        frameRate(5);
        if (radio.value() == 1)
        {
            solveDFS();
            drawPath(); 
        }
        else if (radio.value() == 2)
        {
            solveBFS();
            drawPath();
        }
        else if (radio.value() == 3)
        {
            solveA();
            drawPath();
        }
    }
    else
        frameRate(100); 
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
            fill("#F48484");
            rect(i, j, w, w);
        
        }

    }
    this.highlight = function()
    {
        var i = this.x * w;
        var j = this.y * w;
        noStroke();
        fill('red')
        rect(i,j,w,w)
    }
    this.setTarget = function()
    {
        var i = this.x * w;
        var j = this.y * w;
        noStroke();
        fill('blue')
        rect(i,j,w-10,w-10);
    }
    this.setSolve = function()
    {
        var i = (this.x*w) + w/2;
        var j = (this.y*w) + w/2;
        noStroke();
        fill('green');
        circle(i, j, 50);
    }
    this.setPath = function ()
    {
        var i = (this.x*w) + w/2;
        var j = (this.y*w) + w/2;
        noStroke();
        fill('yellow');
        circle(i, j, 50);
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
    var queue = [];
    var target = grid[(columns*rows) - 1];
    target.setTarget();
    var curr = grid[0];
    queue.push(curr);
    curr.visited_solve = true;
    while (queue.length > 0 && !solved)
    {
        curr = queue.shift();
        curr.setPath();
        if (JSON.stringify(target) === JSON.stringify(curr))
        {
            solved = true;
        }
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
    var stack = [];
    var target = grid[(columns*rows) - 1];
    target.setTarget();
    var curr = grid[0];
    stack.push(curr);
    curr.visited_solve = true;
    while (stack.length > 0 && !solved)
    {
        curr = stack.pop();
        curr.setPath();
        if (JSON.stringify(target) === JSON.stringify(curr))
        {
            solved = true;
        }
        neighbors = curr.checkNeighbors_solve();
        if (neighbors)
        {
            for (let i=0; i < neighbors.length; i++)
            {
                stack.push(neighbors[i]);
                neighbors[i].visited_solve = true;
                neighbors[i].parent = curr;
            }
        }
    }
}
function solveA()
{

}

function drawPath()
{
    var curr = grid[(columns*rows) - 1];
    while (JSON.stringify(curr) !== JSON.stringify(grid[0]))
    {
        curr = curr.parent;
        curr.setSolve();
    }
}