async function genPwd(length) {
    const dictionary = "0123456789abcdefghijklmnopqrstuvwxyz";
    const key = [];
    for (let i = 0; i < length; i++) {
        key.push(dictionary[Math.floor(Math.random() * dictionary.length)]);
    }
    return key.join("");
}



module.exports = genPwd;