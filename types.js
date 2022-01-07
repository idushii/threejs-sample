/**
 * @typedef {Object3D} Micro
 * @property {number} userData.startTime - время начала анимации
 * @property {number} userData.updateTime - время последнего обновления анимации
 * @property {Vector3[]} userData.points - все точки, между которыми происходит перемещение
 * @property {number} userData.index - номер текущей точки
 * @property {Mesh} userData.o2 - объект, куда придет микроб
 * @property {number} hash - признак, что эти микробы - одна транзакция
 * @property {number} value - сколько переносится заряда за тарнзакцию
 */