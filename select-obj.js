import {addLine, select1} from './code.js'
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

        if (!select1) select1 = object;
    }


}

function onSelectTouchEnd(event) {

    const controller = event.target;

    if (controller.userData.selected !== undefined) {

        const object = controller.userData.selected;
        object.material.emissive.b = 0;
        // room.attach(object);


        if (select1 && select1 !== controller.userData.selected) {
            console.log(select1, controller.userData.selected)

            addLine(select1, controller.userData.selected)

            select1 = undefined;
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

window.addEventListener('mousemove', onMouseMove, false);

export {onSelectTouchStart, onSelectTouchEnd, onMouseMove, mouse}