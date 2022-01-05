import * as THREE from './build/three.module.js';
import {intersected, raycaster, renderer, room, scene} from './code.js'
import {onSelectTouchEnd, onSelectTouchStart} from "./select-obj.js";
import {XRControllerModelFactory} from "./jsm/webxr/XRControllerModelFactory.js";

const tempMatrix = new THREE.Matrix4();

function getIntersections(controller) {

    tempMatrix.identity().extractRotation(controller.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObjects(room.children, false);

}

function intersectObjects(controller) {

    // Do not highlight when already selected

    if (controller.userData.selected !== undefined) return;

    const line = controller.getObjectByName('line');
    const intersections = getIntersections(controller);

    if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        object.material.emissive.r = 1;
        intersected.push(object);

        line.scale.z = intersection.distance;

    } else {

        line.scale.z = 5;

    }

}

function cleanIntersected() {

    while (intersected.length) {

        const object = intersected.pop();
        object.material.emissive.r = 0;

    }

}

let controller1, controller2;
let controllerGrip1, controllerGrip2;

function initController() {
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectTouchStart);
    controller1.addEventListener('selectend', onSelectTouchEnd);
    scene.add(controller1);

    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectTouchStart);
    controller2.addEventListener('selectend', onSelectTouchEnd);
    scene.add(controller2);

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    const geometry1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);


    const line = new THREE.Line(geometry1);
    line.name = 'line';
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());

}

export {getIntersections, cleanIntersected, intersectObjects, initController, controller1, controller2}