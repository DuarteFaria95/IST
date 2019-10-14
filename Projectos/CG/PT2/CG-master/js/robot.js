
/*
Falta adicionar o alvo 
*/

var camera, scene, renderer;

var geometry, material, mesh;

var ball, arm, cube;

var keys = [false,false,false,false,false,false,false,false,false,false,false,false];
var dict = new Object();

var cannonBalls=[];

var wall1 = new THREE.Object3D();
var wall2 = new THREE.Object3D();
var wall3 = new THREE.Object3D();

class Cannon{
    constructor(x,y,z,angle){
        this.position = new THREE.Vector3(x,y,z);
        this.angle = angle;
        this.object = new THREE.Object3D();
        this.createCannon(this.object,this.position.x,this.position.y,this.position.z);
    }

    getObject(){
        return this.object;
    }

    getPosition(){
        return this.position;
    }

    getAngle(){
        return this.angle;
    }

    addCannonBarril(obj, x, y, z) {
        'use strict';

        geometry = new THREE.CylinderGeometry(5,4,40,20,20,true,0,Math.PI*2);
        mesh = new THREE.Mesh(geometry, material);
        mesh.rotateZ(Math.PI/2);
        mesh.position.set(x, y, z);
        obj.add(mesh);
    }

    addCannonWeel(obj, x, y, z) {
        'use strict';

        geometry = new THREE.CylinderGeometry(6,6,2,20,20);
        mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI/2);
        mesh.position.set(x, y, z);
        obj.add(mesh);
    }

    createCannon(cannon,x, y, z) {
        'use strict';
        
        material = new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: false});
       
        this.addCannonBarril(cannon,x,y,z);
        this.addCannonWeel(cannon,x+15,y,z+6)
        this.addCannonWeel(cannon,x+15,y,z-6)
    }

    addToscene(){
        scene.add(this.getObject());
    }

    select(){
        var cannon = this.getObject();
        cannon.children[0].material.color.set(0x25a7df);
    }

    deSelect(){
        var cannon = this.getObject();
        cannon.children[0].material.color.set(0x999999);
    }
}


class CannonBall{
    constructor(position){
        this.position = position;
        this.object = new THREE.Object3D();
        this.createCannonBall(this.position.x,this.position.y,this.position.z);
    }

    createCannonBall(x, y, z) {
        'use strict';
        material = new THREE.MeshBasicMaterial({ color:0x666666, wireframe : false});
        geometry = new THREE.SphereGeometry(3,8,8);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        this.object.add(mesh);
        scene.add(this.object);
    }

    getPosition(){
        return this.position;
    }
}

function createDictionary(){
    dict["Q"] = false;
    dict["W"] = false;
    dict["E"] = false;
    dict["left arrow"] = false;
    dict["right arrow"] = false;
    dict["space bar"] = false;
    
}

function addWall(wall,x,y,z,dir){
    
    material = new THREE.MeshBasicMaterial({color: 0x7D7DFD, wireframe: false});
    geometry = new THREE.BoxGeometry(300,8,2,1,1,1);
    mesh = new THREE.Mesh(geometry,material);
    mesh.rotateY(dir*Math.PI/2);
    mesh.position.set(x,y,z);
    wall.add(mesh);
    scene.add(wall);
}

function addFloor(){
    
    var floor = new THREE.Object3D();
    material = new THREE.MeshBasicMaterial({color: 0xCCCCCC, wireframe: false});
    geometry = new THREE.BoxGeometry(350,1,300,1,1,1);
    mesh = new THREE.Mesh(geometry,material);
    mesh.position.set(-125,-0.5,0);
    floor.add(mesh);
    scene.add(floor);
}

function placeRandomCannonBalls(num){
    var pos = new THREE.Vector3(0,5,0);
    var flag = false;
    for (var i = 0 ; i < num; i++) {
        flag = false
        pos.setComponent(0,-Math.floor(Math.random() * 225)-50);
        pos.setComponent(2, Math.floor(Math.random() * 225)-100);
        for (var j= 0 ; j < cannonBalls.lenght; j++) {
            if (pos.x<cannonBalls[j].getPosition().x+7 && pos.x>cannonBalls[j].getPosition().x-7 && pos.z<cannonBalls[j].getPosition().z+7 && pos.z>cannonBalls[j].getPosition().z-7) {
                flag = true;
                break;
            }
        }
        if (flag) {
            i--;
        }
        else{
            let ball = new CannonBall(pos);
            cannonBalls.push(ball);
        }
    }
}

let cannon1 = new Cannon(-10,6,-120);
let cannon2 = new Cannon(-10,6,0);
let cannon3 = new Cannon(-10,6,120);

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(60));
    addWall(wall1,-150,4,-150,0);
    addWall(wall2,-150,4,150,0);
    addWall(wall3,-300,4,0,1);
    addFloor();
    cannon1.addToscene();
    cannon2.addToscene();
    cannon3.addToscene();
    placeRandomCannonBalls(10);
   
}


function createCamera() {
    'use strict';
    camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/-2, 50, 1000);
    //camera.zoom = 3
    setCamera(0,150,0);
    camera.updateProjectionMatrix();
    scene.add(camera);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}

function onKeyDown(e) {
    'use strict';
    
    switch (e.keyCode) {
    
    case 81:
    case 113: //Q
        dict["Q"] = true;
        cannon1.select();
        cannon2.deSelect();
        cannon3.deSelect();   
        break;

    case 87:    
    case 119: //W
        dict["W"] = true;
        cannon1.deSelect();
        cannon2.select();
        cannon3.deSelect(); 
        break;

    case 69:
    case 101:
        dict["E"] = true;
        cannon1.deSelect();
        cannon2.deSelect();
        cannon3.select(); 
        break;

    case 37: // left arrow
        dict["left arrow"] = true;
        break;

    case 39: // right arrow
        dict["right arrow"] = true;      
        break;

    case 49: // 1 Vista de cima
        setCamera(0,150,0);
        break;
        
    case 50: //2 diagonal  
        setCamera(150,150,150);
        break;
    
    case 51: //3 frontal
        setCamera(130,20,130);
        break;
    }   
}


function onKeyup(e) {
    'use strict';
    
    switch (e.keyCode) {
    
        case 81:
        case 113: //Q
            dict["Q"] = false;    
            break;
        case 87:
        case 119: //W
            dict["W"] = false;
            break;    
        case 37: // left arrow    
            dict["left arrow"] = false;
            break;
        case 39: // right arrow
            dict["right arrow"] = false;      
            break;
    }
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function setCamera(x,y,z){
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    camera.lookAt(scene.position);
}

function update(){
    
    
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
   
    createScene();
    createCamera();
    render();
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyup);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    
    update();
    render();
    requestAnimationFrame(animate);
}