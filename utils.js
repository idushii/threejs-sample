/**
 * Получить радиус шара, исходя из его объема.
 * @param v
 * @returns {number}
 */
function getRadiusByV(v = 1) {
    return Math.pow((v / 3.141592) * (3/4), 1/3);
}

export {getRadiusByV}