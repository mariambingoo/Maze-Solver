var columns;
var rows;
var w = 60;
var grid = [];
var current;


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
    frameRate(5)
    current = grid[0];



}
function draw()
{
    background("#1F8A70")
    for (var i = 0; i< grid.length; i++)
    {
        grid[i].drawL();
    }
    current.visited = true;
    var next = current.checkNeighbors();
    if (next)
    {
        next.visited = true;
        current = next;
        }

}
function index(x, y)
{
    if (x < 0 || y < 0|| x>columns-1 ||y>rows-1)
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
    this.visited = false;
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
    this.drawL = function ()

    {
        var i= this.x * w;
        var j = this.y * w;
        stroke(255);

        
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
            rect(i, j, w, w);
            fill("#F48484");
        }

    }


}
