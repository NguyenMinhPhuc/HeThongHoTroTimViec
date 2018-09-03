//Get
async function ajaxGetHttpMethod(namePath) {
    return await $.ajax({
        type: 'GET',
        url: namePath
    })
};
//Post
async function ajaxPostHttpMethod(objectValueData, namePath) {
    return await $.ajax({
        type: 'POST',
        url: namePath,
        data: objectValueData
    })
};
//Put
async function ajaxPutHttpMethod(objectValueData, namePath) {
    return await $.ajax({
        type: 'PUT',
        url: namePath,
        data: objectValueData
    })
};
//Delete
async function ajaxDeleteHttpMethod(objectValueData, namePath) {
    return await $.ajax({
        type: 'DELETE',
        url: namePath,
        data: objectValueData
    })
};