import {addLine, camera, raycaster, room} from './code.js'
import * as THREE from './build/three.module.js';
import {getIntersections} from "./touch.js";

const mouse = new THREE.Vector2();

function onSelectTouchStart(event) {

    const controller = event.target;

    const intersections = getIntersections(controller);

    if (intersections.length > 0) {

        const intersection = intersections[0];

        const object = intersection.object;
        object.material.emissive.b = 1;
        // controller.attach(object);

        controller.userData.selected = object;

        if (!window.select1) window.select1 = object;
    }


}

function onSelectTouchEnd(event) {

    const controller = event.target;

    if (controller.userData.selected !== undefined) {

        const object = controller.userData.selected;
        object.material.emissive.b = 0;
        // room.attach(object);


        if (window.select1 && window.select1 !== controller.userData.selected) {
            console.log(window.select1, controller.userData.selected)

            addLine(window.select1, controller.userData.selected)

            window.select1 = undefined;
        }

        controller.userData.selected = undefined;

    }
}

function onMouseMove(event) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

function onMouseUp(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersected = raycaster.intersectObjects(room.children).map(e => e.object);

    if (!intersected[0]) return;

    if (window.select1 && window.select1 !== intersected[0]) {
        console.log(window.select1, intersected[0])

        addLine(window.select1, intersected[0])

        window.select1 = undefined;
    } else {
        window.select1 = intersected[0];
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mouseup', onMouseUp, false);

export {onSelectTouchStart, onSelectTouchEnd, onMouseMove, mouse}