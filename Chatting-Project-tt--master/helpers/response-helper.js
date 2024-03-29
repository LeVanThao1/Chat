function ResponseSuccess(message, data, res) {
    if (!res) {
        return {
            message,
            data
        };
    }
    return res.status(200).json({
        message,
        data
    });
}

function ResponseError(message, res) {
    if (!res) {
        return {
            message
        };
    }
    return res.status(400).json({
        success: false,
        message
    });
}

module.exports = {
    ResponseSuccess,
    ResponseError
};