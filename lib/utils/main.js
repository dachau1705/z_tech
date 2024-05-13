export function removeBuffer(obj) {
    if (Buffer.isBuffer(obj)) {
        return "buffer";
    }

    if (isObject(obj)) {
        const newObj = {};
        for (let key of Object.keys(obj)) {
            if (Buffer.isBuffer(obj[key])) {
                newObj[key] = "buffer";
            } else if (isObject(obj[key]) || Array.isArray(obj[key])) {
                newObj[key] = removeBuffer(obj[key]);
            } else {
                newObj[key] = obj[key];
            }
        }
        return newObj;
    } else if (Array.isArray(obj)) {
        const newArr = [];
        for (let i = 0; i < obj.length; i++) {
            if (Buffer.isBuffer(obj[i])) {
                newArr[i] = "buffer";
            } else if (isObject(obj[i]) || Array.isArray(obj[i])) {
                newArr[i] = removeBuffer(obj[i]);
            } else {
                newArr[i] = obj[i];
            }
        }
        return newArr;
    }

    return obj;
}