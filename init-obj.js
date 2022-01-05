import * as THREE from "./build/three.module.js";
import {radius, room} from "./code.js";

function initObj() {
    addObj(1.1, 1.3, -2, 1);
    addObj(1, 2.2, -2, 1);
    addObj(-1, 1.1, -2, 1);
    addObj(-1.2, 2.1, -2, 1);

}


function addObj(x = 0, y = 0, z = 0, size = 1) {
    const geometry = new THREE.IcosahedronGeometry(radius * size, 3);
    const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));

    object.position.x = x;
    object.position.y = y;
    object.position.z = z;

    room.add(object);
}

export {initObj}