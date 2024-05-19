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

cleanInput = (req, res) => {
    req = req.replace(/\r\n/g, '');
    return req;
};

function getTimingForSentence(sentence) {
    let wordPerMin = 80;
    let wordCount = sentence.split(' ').length;
    return (wordCount / wordPerMin) * 60;
}

module.exports = { getSentences, cleanInput, getTimingForSentence }
