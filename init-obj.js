import * as THREE from "./build/three.module.js";
import {radius, room} from "./code.js";

function initObj() {
    addObj(1.1, 1.3, -2, 1);
    addObj(1, 2.2, -2, 1);
    addObj(-1, 1.1, -2, 1);
    addObj(-1.2, 2.1, -2, 1);

}

/**
 *
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @param {number} size
 * @param {Object3D} group
 */
function addObj(x = 0, y = 0, z = 0, size = 1, group = room) {
    const geometry = new THREE.IcosahedronGeometry(radius * size, 3);
    const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));

    object.position.x = x;
    object.position.y = y;
    object.position.z = z;

    group.add(object);

    return object;
}

export {initObj, addObj}