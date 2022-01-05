import * as THREE from './build/three.module.js';

import {BoxLineGeometry} from './jsm/geometries/BoxLineGeometry.js';
import {VRButton} from './jsm/webxr/VRButton.js';
import {cleanIntersected, controller1, controller2, initController, intersectObjects} from './touch.js'
import {initObj} from "./init-obj.js";

let camera, scene, renderer;


let room;

const radius = 0.1;

let raycaster;

const intersected = [];

init();
animate();

console.log('code1.js')

let select1;

export {select1, room, raycaster, intersected, renderer, scene, radius, addLine}

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    room = new THREE.LineSegments(
        new BoxLineGeometry(6, 6, 6, 10, 10, 10),
        new THREE.LineBasicMaterial({color: 0x808080})
    );
    room.geometry.translate(0, 3, 0);
    scene.add(room);

    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);


    // for (let i = 0; i < 10; i++) {
    //
    //     const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    //
    //     object.position.x = Math.random() * 4 - 2;
    //     object.position.y = Math.random() * 4;
    //     object.position.z = Math.random() * 4 - 2;
    //
    //     object.userData.velocity = new THREE.Vector3();
    //     object.userData.velocity.x = Math.random() * 0.01 - 0.005;
    //     object.userData.velocity.y = Math.random() * 0.01 - 0.005;
    //     object.userData.velocity.z = Math.random() * 0.01 - 0.005;
    //
    //     room.add(object);
    //
    // }


    initObj();

    function addAnimateMove(o1, o2) {
        const i1 = room.children.findIndex(e => e === o1);
        const i2 = room.children.findIndex(e => e === o2);

        console.log(`add move ${i1} => ${i2}`)

        const geometry = new THREE.IcosahedronGeometry(radius * size, 3);
        const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));

        object.position.x = o1.position.x;
        object.position.y = o1.position.y;
        object.position.z = o1.position.z;


        scene.add(object);
    }

    //


    raycaster = new THREE.Raycaster();


    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    //

    document.body.appendChild(VRButton.createButton(renderer));


    initController();


    window.addEventListener('resize', onWindowResize);

}


function addLine(o1, o2) {
    const i1 = room.children.findIndex(e => e === o1);
    const i2 = room.children.findIndex(e => e === o2);

    console.log(`add line ${i1} => ${i2}`)

    const geometry = new THREE.BufferGeometry().setFromPoints([o1.position, o2.position]);
    const material = new THREE.LineBasicMaterial({color: 0xffffff});

    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


//

function animate() {

    renderer.setAnimationLoop(render);

}

function render() {

    console.log({dd: renderer.xr.isPresenting()})

    cleanIntersected();

    intersectObjects(controller1);
    intersectObjects(controller2);

    renderer.render(scene, camera);

}