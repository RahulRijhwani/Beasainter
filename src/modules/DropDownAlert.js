var dropDownAlert = ""

const setDropDownRef = (ref) => {
    dropDownAlert = ref
}

const showAlert = (type, title, message, data, duration) => {
    if (type === "custom") {
        dropDownAlert.alertWithType(type, title, message, data, duration);
    } else {
        dropDownAlert.alertWithType(type, title, message);
    }
}

export default {
    setDropDownRef,
    showAlert
}