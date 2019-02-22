function set_bounds() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
}
var canvas = document.querySelector('canvas');
set_bounds();
document.addEventListener('resize', set_bounds);
var c = canvas.getContext('2d');

function play_with_this_backdrop() {
    var body = document.getElementsByTagName('body');
    body[0].parentElement.removeChild(body[0]);
    document.write(
        "<!DOCTYPE html>\n" +
        "<html style=\"margin:0;\">\n" +
            "<head>\n" +
                "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/backdrop.css\">\n" +
            "</head>\n" +
            "<body onload=\"set_bounds()\" onresize=\"set_bounds()\" style=\"font-family:calibri;background-color:#2a2a2a;margin:0;\">\n" +
                "<canvas id=\"backdrop\"></canvas>\n" +
                "<script src=\"backdrop.js\"></script>\n" +
                "<script src=\"simplex-noise.js\"></script>" +
                "<a href=\"index.html\" style=\"text-decoration:none\">" +
                    "<div style=\"display:inline-flex;float:left;font-size:30px;color:#999795;width:80px;margin:auto;background-color:darkblue;padding:30px;\">< Back</div>" +
                "</a>" +
            "</body>\n" +
        "</html>");
}

function random_range(min, max) {
    return Math.round((Math.random() * (max - min)) + min);
}

var NUM_SETTINGS = 3;
var backdrop_setting = random_range(1, NUM_SETTINGS);

/**************************************************************************************
 *  Bouncing Circles Backdrop
 **************************************************************************************/
if (backdrop_setting == 1) {
    var circles = [];
    var mouse = {
        x: undefined,
        y: undefined,
        vx: undefined,
        vy: undefined
    };
    var rad_max = 50;
    var rad_min = 10;
    var range = 50;
    var max_vel = 5;
    var mousedown = false;
    var colors = [
        '#a3a3a3',
        '#7c7c7c',
        '#595959',
        '#474747',
        '#070707'
    ];

    window.addEventListener('mousemove', function(event) {
        mouse.vx = ((event.x - mouse.x) / 4) % max_vel;
        mouse.vy = ((event.y - mouse.y) / 4) % max_vel;
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mousedown', function(event) {
        mousedown = true;
    });
    window.addEventListener('mouseup', function(event) {
        mousedown = false;
    });

    function Circle(x, y, radius, vx, vy, color) {
        this.x = x;
        this.y = y; 
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;

        this.draw = function() {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = colors[color];
            c.fill();
        }
        this.tick = function() {
            if (this.x + this.radius > innerWidth) this.vx = -Math.abs(this.vx);
            else if (this.x - this.radius < 0) this.vx = Math.abs(this.vx);
            if (this.y + this.radius > innerHeight) this.vy = -Math.abs(this.vy);
            else if (this.y - this.radius < 0) this.vy = Math.abs(this.vy);
            this.x += this.vx;
            this.y += this.vy;
            if (Math.abs(mouse.x - this.x) < range && Math.abs(mouse.y - this.y) < range) {
                if (this.radius < rad_max) this.radius += 1;
                if (mousedown) {
                    this.vx = mouse.vx;
                    this.vy = mouse.vy;
                }
            }
            else if (this.radius > rad_min){
                this.radius -= 1;
            }
            this.draw();
        }
    }


    for (var i = 0; i < 500; i++) {
        var radius = rad_min;
        circles.push(new Circle(
            (Math.random() * (innerWidth - radius * 2) + radius),
            (Math.random() * (innerHeight - radius * 2) + radius),
            radius,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 3,
            Math.floor((Math.random() * colors.length))
        ));
    }

    function update() {
        window.requestAnimationFrame(update);
        c.clearRect(0, 0, innerWidth, innerHeight);
        for (var i = 0; i < circles.length; i++) {
            circles[i].tick();
        }
    }
    update();
}
/**************************************************************************************
 *  Particle Backdrop code
 **************************************************************************************/
else if (backdrop_setting == 2) {
    
    //constants
    const NUM_PARTICLES = 500;
    const MIN_RADIUS = 2;
    const MAX_RADIUS = 10;
    const MOVE_CONSTANT = 0.01;
    const colors = [
        '#7c7c7c',
        '#696969',
        '#595959',
        '#353535',
    ];

    //variables
    var mouse = {
        x: 0,
        y: 0
    };
    var particles = [];
    
    //listeners
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    //objects
    function Particle(x, y, radius, color) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y; 
        this.radius = radius;
        this.color = color;

        this.draw = function() {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = colors[this.color];
            c.fill();
        }
        this.tick = function() {

            this.x = this.startX - (mouse.x - this.startX) * (this.radius * this.radius / MAX_RADIUS) * MOVE_CONSTANT;
            this.y = this.startY - (mouse.y - this.startY) * (this.radius * this.radius / MAX_RADIUS) * MOVE_CONSTANT;

            if (this.x + this.radius > innerWidth || this.x - this.radius < 0) return;
            if (this.y + this.radius > innerHeight || this.y - this.radius < 0) return;
            this.draw();
        }
    }


    function update() {
        window.requestAnimationFrame(update);
        c.clearRect(0, 0, innerWidth, innerHeight);
        for (var i in particles) {
            particles[i].tick();
        }
    }
    function init() {
        for (var i = 0; i < NUM_PARTICLES; i++) {
            radius = random_range(MIN_RADIUS, MAX_RADIUS);
            particles.push(
                new Particle(
                        random_range(0, innerWidth),
                        random_range(0, innerHeight),
                        radius,
                        Math.floor((1 - (radius / MAX_RADIUS)) * colors.length)
                        )
            );
        }
        particles.sort(function(a, b){return a.radius - b.radius});

    }
    init();
    update();
}
 /**************************************************************************************
 *  Wave Backdrop code
 **************************************************************************************/
else if (backdrop_setting == 3) {

    /**
     * requestAnimationFrame
     */
    window.requestAnimationFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();


    // Configs

    var Configs = {
        backgroundColor: '#2a2a2a',
        particleNum: 1000,
        step: 5,
        base: 1000,
        zInc: 0.001
    };


    // Vars

    var canvas,
        context,
        screenWidth,
        screenHeight,
        centerX,
        centerY,
        particles = [],
        hueBase = 0,
        simplexNoise,
        zoff = 0,
        gui;


    // Initialize

    function init() {
        canvas = document.getElementById('backdrop');

        window.addEventListener('resize', onWindowResize, false);
        onWindowResize(null);

        for (var i = 0, len = Configs.particleNum; i < len; i++) {
            initParticle((particles[i] = new Particle()));
        }

        simplexNoise = new SimplexNoise();

        canvas.addEventListener('click', onCanvasClick, false);

        update();
    }


    // Event listeners

    function onWindowResize(e) {
        screenWidth  = canvas.width  = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;

        centerX = screenWidth / 2;
        centerY = screenHeight / 2;

        context = canvas.getContext('2d');
        context.lineWidth = 0.3;
        context.lineCap = context.lineJoin = 'round';
    }

    function onCanvasClick(e) {
        context.save();
        context.globalAlpha = 0.8;
        context.fillStyle = Configs.backgroundColor;
        context.fillRect(0, 0, screenWidth, screenHeight);
        context.restore();
        
        simplexNoise = new SimplexNoise();
    }


    // Functions

    function getNoise(x, y, z) {
        var octaves = 4,
            fallout = 0.5,
            amp = 1, f = 1, sum = 0,
            i;

        for (i = 0; i < octaves; ++i) {
            amp *= fallout;
            sum += amp * (simplexNoise.noise3D(x * f, y * f, z * f) + 1) * 0.5;
            f *= 2;
        }

        return sum;
    }

    function initParticle(p) {
        p.x = p.pastX = screenWidth * Math.random();
        p.y = p.pastY = screenHeight * Math.random();
        p.color.h = hueBase + Math.atan2(centerY - p.y, centerX - p.x) * 180 / Math.PI;
        p.color.s = 1;
        p.color.l = 0.5;
        p.color.a = 0;
    }


    // Update
    var count = 0;
    function update() {
        var step = Configs.step,
        base = Configs.base,
        i, p, angle;
        
        for (i = 0, len = particles.length; i < len; i++) {
            p = particles[i];
            
            p.pastX = p.x;
            p.pastY = p.y;
            
            angle = Math.PI * 6 * getNoise(p.x / base * 1.75, p.y / base * 1.75, zoff);
            p.x += Math.cos(angle) * step;
            p.y += Math.sin(angle) * step;
            
            if (p.color.a < 1) p.color.a += 0.003;
            
            context.beginPath();
            context.strokeStyle = p.color.toString();
            context.moveTo(p.pastX, p.pastY);
            context.lineTo(p.x, p.y);
            context.stroke();
            
            if (p.x < 0 || p.x > screenWidth || p.y < 0 || p.y > screenHeight) {
                initParticle(p);
            }
        }
        
        hueBase += 0.1;
        zoff += Configs.zInc;
        if (count > 60 * 10) return;
        count++;
        requestAnimationFrame(update);
    }


    /**
     * HSLA
     */
    function HSLA(h, s, l, a) {
        this.h = h || 0;
        this.s = s || 0;
        this.l = l || 0;
        this.a = a || 0;
    }

    HSLA.prototype.toString = function() {
        return 'hsla(' + this.h + ',' + (this.s * 100) + '%,' + (this.l * 100) + '%,' + this.a + ')';
    }

    /**
     * Particle
     */
    function Particle(x, y, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = color || new HSLA();
        this.pastX = this.x;
        this.pastY = this.y;
    }

    init();
}