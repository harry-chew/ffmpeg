function IsInputEmpty(req, res) {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("No uploads");
            return res.status(400).send('No files were uploaded.');
        }
        if (!req.files.images) {
            console.log("No Images");
            return res.status(400).send('No images were uploaded.');
        }
    } catch (error) {
        return error;
    }
}

module.exports = { IsInputEmpty }