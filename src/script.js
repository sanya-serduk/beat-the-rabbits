var GAME = new function() {

    // Создаем необходимые переменные для игры
    var elem = {};
    var arrEnemy = [];
    var score, timeShowEnemy, game;

    // Ф-ция для создания DIV элементов
    var createElem =  function(parentElem, className, before) {
        var element = document.createElement('div');
        element.className = className;
        parentElem.appendChild(element);

        if(before) parentElem.insertBefore(element, before);
        else       parentElem.appendChild(element);

        return element;
    };

    // Ф-ция для определения координат элемента
    var coorElem = function(elem) {
        var coor = elem.getBoundingClientRect();
        return {
            x : coor.left + coor.width  / 2,
            y : coor.top  + coor.height / 2
        };
    };

    // Создание DIV элементов игры
    var createGame = function(parentElem) {
        elem.game = createElem(parentElem, "game");

        elem.playField = createElem(elem.game, "game__play-field");
        elem.playFieldItem = [];
        elem.enemy = [];

        for(var i = 0; i < 16; i++) {
            elem.playFieldItem[i] = createElem(elem.playField, "game__play-field-item");
            elem.enemy[i] = createElem(elem.playFieldItem[i], "game__enemy");
        }

        elem.start     = createElem(elem.game,   "game__start");
        elem.startHead = createElem(elem.start,  "game__start-head");
        elem.startEnd  = createElem(elem.start,  "game__start-end");
        elem.btnPlay   = createElem(elem.start,  "game__start-btn");
        elem.weapon    = createElem(elem.game,   "game__weapon");
        elem.gun       = createElem(elem.weapon, "game__weapon-gun");
        elem.platform  = createElem(elem.weapon, "game__weapon-platform");

        createElem(elem.btnPlay,'game__weapon-bomb');
    };

    // Обработка клика
    var fire = function(e) {
        var bull = createElem(elem.weapon, 'game__weapon-bullet', elem.gun);
        var coor = coorElem(bull);
        var distance = Math.sqrt(Math.pow(e.pageX - coor.x, 2) + Math.pow(e.pageY - coor.y, 2));

        bull.style.cssText = 'transform: translate('+(e.clientX-coor.x)+'px, '+(e.clientY-coor.y)+'px); transition: linear '+distance+'ms';

        setTimeout(function(){
            elem.weapon.removeChild(bull);

            if (e.target.parentNode.offsetParent === elem.playField) {
                for(var i = 0; i < elem.enemy.length; i++) {
                    if(e.target === elem.enemy[i] && arrEnemy.indexOf(i) === -1) {
                        elem.enemy[i].classList.remove('game__enemy-transform');
                        arrEnemy.push(i);
                        score++;
                        elem.score.innerText = String(score);
                        break;
                    }
                }
            } else if(e.target === elem.btnPlay) {
                var hole = createElem(elem.btnPlay,'game__weapon-bomb');
                hole.style.cssText = 'display: block; left: '+(e.pageX)+'px; top: '+(e.pageY)+'px';

                setTimeout(function () {
                    elem.btnPlay.innerHTML = '';
                    if(!game) play();
                }, 500);
            }
        }, distance);
    };

    // Цикл показа врагов
    var showEnemy = function() {
        var rand = arrEnemy[Math.floor(Math.random() * arrEnemy.length)];
        elem.enemy[rand].classList.add('game__enemy-transform');
        arrEnemy.splice(arrEnemy.indexOf(rand), 1);

        if(arrEnemy.length < 11) {
            gameOver();
        } else {
            timeShowEnemy -= 5;

            setTimeout(function () {
                showEnemy();
            }, timeShowEnemy);
        }
    };

    // Начало игры
    var play = function() {
        game = true;
        score = 0;
        timeShowEnemy = 1000;
        elem.start.style.display = 'none';
        elem.score = createElem(elem.game,'game__count');
        elem.score.innerText = String(0);
        for(var i=0; i < elem.enemy.length; i++) {
            elem.enemy[i].classList.remove('game__enemy-transform');
            arrEnemy[i] = i;
        }
        showEnemy();
    };

    // Конец игры
    var gameOver = function() {
        game = false;
        elem.game.removeChild(elem.score);
        elem.startEnd.innerText = "Игра окончена. Ваш счет : "+String(score);
        elem.start.style.display = 'block';
    };

    // Создаем игру, вешаем обработчики
    this.start = function(parentElem) {
        elem.parent = parentElem || document.body;
        createGame(elem.parent);

        elem.game.addEventListener('mousemove', function(e) {
            var coorGun = coorElem(elem.gun);
            var rad = Math.atan2((e.pageY) - coorGun.y, (e.pageX) - coorGun.x);
            elem.gun.style.transform = 'rotate('+rad+'rad)';
        });

        elem.game.addEventListener('click', fire);
    };
};

window.addEventListener('load', function() {
    GAME.start(document.body);
});