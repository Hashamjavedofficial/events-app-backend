
function bufferToImage (buffer){
    return new Buffer.from(buffer).toString("base64");
}

module.exports = {
    bufferToImage
}