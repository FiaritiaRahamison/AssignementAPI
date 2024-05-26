const responde = (data, message = 'ok') => {
    return {
        message: message,
        data: data
    }
};

module.exports = responde;