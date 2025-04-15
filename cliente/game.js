// Inicialización del canvas y contexto
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var contador = 0;

// Función para dibujar un rectángulo
function drawRect(x, y, color) {
    var size = 20;
    var padding = 1.5;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect((size + padding) * x, (size + padding) * y, size, size);
    ctx.fill();
}

// Función para dibujar un círculo
function drawCircle(x, y, color) {
    var size = 20;
    var padding = 1.5;
    var centerX = (size + padding) * x + size / 2;
    var centerY = (size + padding) * y + size / 2;
    var radius = size / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

var tableSize = 37;

// Clase para el jugador
class User {
    constructor(x, y, color, direccion) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.dire = direccion;
        this.direccionAnterior = -1;
        this.tailList = [];
    }

    update() {
        var prev = { x: this.x, y: this.y };
        for (var i in this.tailList) {
            var temp = this.tailList[i];
            this.tailList[i] = prev;
            prev = temp;
        }
        switch (this.dire) {
            case 0:
                if (this.direccionAnterior != 2) {
                    this.x -= 1;
                    this.direccionAnterior = 0;
                } else {
                    this.x += 1;
                }
                break;
            case 1:
                if (this.direccionAnterior != 3) {
                    this.y -= 1;
                    this.direccionAnterior = 1;
                } else {
                    this.y += 1;
                }
                break;
            case 2:
                if (this.direccionAnterior != 0) {
                    this.x += 1;
                    this.direccionAnterior = 2;
                } else {
                    this.x -= 1;
                }
                break;
            case 3:
                if (this.direccionAnterior != 1) {
                    this.y += 1;
                    this.direccionAnterior = 3;
                } else {
                    this.y -= 1;
                }
                break;
        }
        this.x = this.loop(this.x);
        this.y = this.loop(this.y);
    }

    addTail() {
        this.tailList.push({ x: this.x, y: this.y });
    }

    loop(value) {
        if (value < 0) {
            value = tableSize - 1;
        } else if (value > tableSize - 1) {
            value = 0;
        }
        return value;
    }
}

// Clase para los ítems
class Item {
    x = 0;
    y = 0;
    cont = 0;
    color = "#8c8888";
    randomPosition() {
        this.x = parseInt(Math.random() * tableSize);
        this.y = parseInt(Math.random() * tableSize);
    }
}

var user = new User(0, 0, "#78bdc0", 2);
var user2 = new User(36, 36, "#c24533", 0);
var items = [];

for (var i = 0; i < 15; i++) {
    var item = new Item();
    item.cont = i;
    item.randomPosition();
    items.push(item);
}

fin = false;

setInterval(function () {
    for (var x = 0; x < tableSize; x++) {
        for (var y = 0; y < tableSize; y++) {
            drawRect(x, y, "#eeeeee");
        }
    }
    user.update();
    user2.update();
    for (var i in items) {
        if ((user.x == items[i].x && user.y == items[i].y)) {
            user.addTail();
            items[i].randomPosition();
            break;
        }
        if ((user2.x == items[i].x && user2.y == items[i].y)) {
            user2.addTail();
            items[i].randomPosition();
            break;
        }
    }

    for (var i in user.tailList) {
        var p = user.tailList[i];
        if (user2.x == p.x && user2.y == p.y) {
            fin = true;
            alert("Rojo perdió");
        }
        drawRect(p.x, p.y, user.color);
    }
    drawRect(user.x, user.y, user.color);

    for (var i in user2.tailList) {
        var p = user2.tailList[i];
        if (user.x == p.x && user.y == p.y) {
            fin = true;
            alert("Azul perdió");
        }
        drawRect(p.x, p.y, user2.color);
    }
    drawRect(user2.x, user2.y, user2.color);

    for (var i in items) {
        if ((items[i].cont + contador) % 16 == 0) {
            drawRect(items[i].x, items[i].y, "#eeeeee");
        } else {
            drawCircle(items[i].x, items[i].y, "#dac348");
        }
    }
    contador += 1;
}, 100);

window.onkeydown = function (e) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
        user.dire = e.keyCode - 37;
    }
    if (e.keyCode == 65) {
        user2.dire = 0;
    } else if (e.keyCode == 87) {
        user2.dire = 1;
    } else if (e.keyCode == 68) {
        user2.dire = 2;
    } else if (e.keyCode == 83) {
        user2.dire = 3;
    }
}
