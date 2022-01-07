import * as THREE from './build/three.module.js';
import {Vector3} from './build/three.module.js';

import {BoxLineGeometry} from './jsm/geometries/BoxLineGeometry.js';
import {VRButton} from './jsm/webxr/VRButton.js';
import {cleanIntersected, controller1, controller2, initController, intersectObjects} from './touch.js'
import {addObj, initObj} from "./init-obj.js";
import {mouse} from "./select-obj.js";

let camera, scene, renderer;


/**
 * @type {LineSegments} - комната, в которой все находится.
 */
let room;
/**
 * @type {Group} - микробы
 */
let microGroups;

const radius = 0.1;

let raycaster;

let intersected = [];

init();
animate();

console.log('code1.js')

window.select1 = undefined;

export {room, microGroups, raycaster, intersected, renderer, scene, radius, addLine, camera}

/**
 * Начальная подготовка приложения
 */
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
    microGroups = new THREE.Group();
    scene.add(microGroups);

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

    raycaster = new THREE.Raycaster();
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));
    initController();
    window.addEventListener('resize', onWindowResize);
}

/**
 * Случайное целочисленное значение между двуми числами
 * @param {number} i1
 * @param {number} i2
 * @returns {number}
 */
function getRandomBetween(i1 = 1, i2 = 100) {
    return Math.round(Math.random() * 100 % (i2 - i1)) + i1;
}

/**
 * Генерация кастомного пути, со случайными изгибами
 * @param {Vector3} p1
 * @param {Vector3} p2
 */
function customPath(p1, p2) {
    const countPoints = getRandomBetween(1, p1.distanceTo(p2) * 5);
    console.log({countPoints})

    const points = [p1]

    const dx = (p1.x - p2.x) / countPoints, dy = (p1.y - p2.y) / countPoints, dz = (p1.z - p2.z) / countPoints;

    for (let i = 0; i < countPoints; i++) {
        points.push(new THREE.Vector3(
            p1.x - dx * i - dx * getRandomBetween(1, 50) / 50,
            p1.y - dy * i - dy * getRandomBetween(1, 50) / 50,
            p1.z - dz * i - dz * getRandomBetween(1, 50) / 50,
        ))
    }

    points.push(p2)

    const curve = new THREE.CatmullRomCurve3(points);
    const points1 = curve.getPoints(p1.distanceTo(p2) * 300);
    // const geometry = new THREE.BufferGeometry(); // Объявление объекта геометрии Геометрия
    // geometry.setFromPoints(points1);
    // const material = new THREE.LineBasicMaterial({color: 0x000000});
    // scene.add(new THREE.Line(geometry, material)); // Линейные объекты добавляются на сцену

    return points1;
}

/**
 * Добавление микроба для анимации
 *
 * @param {Vector3[]} points
 */
function addMicro(points = []) {
    const startPoint = points[0];
    /** @type {Micro} */
    const micro = addObj(startPoint.x, startPoint.y, startPoint.z, 0.2, microGroups)
    micro.userData = {points, index: 0, startTime: Date.now(), updateTime: Date.now()};
}

/**
 * Нарисовать линию заданного цвета
 *
 * @param {Vector3} p1
 * @param {Vector3} p2
 * @param {number} color
 */
function drawLine(p1, p2, color = 0xffffff) {
    const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const material = new THREE.LineBasicMaterial({color});

    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

/**
 * Добавление прямой линии между выбранными объектами
 *
 * @param {Object3D} o1
 * @param {Object3D} o2
 */
function addLine(o1, o2) {
    const i1 = room.children.findIndex(e => e === o1);
    const i2 = room.children.findIndex(e => e === o2);

    console.log(`add line ${i1} => ${i2}`)

    // drawLine(o1.position, o2.position)

    addMicro(customPath(o1.position, o2.position))
    addMicro(customPath(o1.position, o2.position))
    addMicro(customPath(o1.position, o2.position))
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
    cleanIntersected();

    if (renderer.xr.isPresenting) {
        intersectObjects(controller1);
        intersectObjects(controller2);
    } else {
        room.children.forEach(item => item.material.color.set(0xffffff))

        raycaster.setFromCamera(mouse, camera);
        intersected = raycaster.intersectObjects(scene.children).map(e => e.object);

        for (let i = 0; i < intersected.length; i++) {
            // intersected[i].material.opacity = 0.8;
            intersected[i].material.color.set(0xff0000);
        }
    }

    for (let key in microGroups.children) {

        /** @type {Micro} */
        const micro = microGroups.children[key];

        if (Date.now() - micro.userData.updateTime > 20) {
            micro.userData.index++;
            if (micro.userData.index > (micro.userData.points.length - 2)) microGroups.children.splice(key, 1);
            const pos = micro.userData.points[micro.userData.index];
            micro.position.set(...pos);
            micro.userData.updateTime = Date.now();
        }
    }


    renderer.render(scene, camera);

}

