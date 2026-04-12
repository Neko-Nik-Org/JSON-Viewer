import json5 from "json5";

// Check if a string is a valid JSON
function isValidJSON(stringData) {
    if (!stringData || !stringData.trim()) return false;
    try {
        json5.parse(stringData);
        return true;
    } catch (e) {
        return false;
    }
}


// Minify a JSON string – throws if invalid (let callers show the UI error)
function minifyJSON(jsonData) {
    return JSON.stringify(json5.parse(jsonData));
}


// Beautify a JSON string – throws if invalid (let callers show the UI error)
function beautifyJSON(jsonData) {
    return JSON.stringify(json5.parse(jsonData), null, 2);
}


// Reset editor content
function clearData(setXXXData) {
    setXXXData('');
}


export { isValidJSON, minifyJSON, beautifyJSON, clearData };