/* 
運作流程: 
    資源載入完成後自動調用windows.onload()->
    init()->mainloop-> [upadte->draw]反覆循環
    requestAnimationFrame為類似自動垂直同步的timer
keys: 
    按鍵被按下為true,按下a後keys[65]為true,詳細可看console.log(keys);
mousePos:
    滑鼠當前位置 mousePos.x,mousePox.y 即可存取
*/

var target1, target2, shooter;
var entities = [];

var spaceDown = 0;

function init() {
    console.log("Start");
    ctx_backColor = "#777"

    target1 = new Entity(random(0, width), random(0, height) * 3 / 4, 20, 'target1');
    target1.color = 'rgba(255,255,127,0.8)';
    target1.vel.setLength(200);
    target1.vel.setAngleDeg(-35);

    target2 = new Entity(random(0, width), random(0, height) * 3 / 4, 20, 'target2');
    target2.color = 'rgba(255,200,100,0.89)';
    target2.vel.setLength(100);
    target2.vel.setAngleDeg(-135);


    shooter = new Shooter(width / 2, height * 3 / 4, 20, 'shooter');
    shooter.color = 'rgba(255,127,127,0.7)';
    shooter.target = target1;

    entities.push(target1);
    // entities.push(target2);
    entities.push(shooter);
}

function getEntityById(id) {
    var result = [];
    entities.forEach((ele, index) => {
        if (ele.id == id) {
            result.push(ele);
        }
    });
    return result;
}
// loop star
function update(dt) {
    if (keys['32']) spaceDown = !spaceDown;
    if (spaceDown) return;

    for (let obj of entities) {
        obj.update(dt);
        // debugger;
    }


    for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i];
        if (entity.isDead) entities.splice(i, 1);
    }
}


function draw(ctx) {
    for (let obj of entities) {
        obj.render(ctx);
    }
}
