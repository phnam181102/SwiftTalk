export const convertToFlatObject = (data) => {
    const flatArray = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            flatArray.push(...data[key]);
        }
    }
    return flatArray;
};
