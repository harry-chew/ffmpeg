getSentences = (req, res) => {
    req = req.replace(/\r\n/g, '');
    const sentences = req.split('.');

    const returnSentences = [];
    sentences.forEach((sentence) => {
        if (sentence != '') {
            sentence = sentence + '.';
            returnSentences.push(sentence);
        }
    });

    return returnSentences;
};


module.exports = { getSentences }