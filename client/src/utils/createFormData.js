export const createFormData = (type, file) => {
    const formData = new FormData();
    formData.append(type, file);
    return formData;
};
