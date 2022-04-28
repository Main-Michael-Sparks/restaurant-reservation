/**
 * Formats a time string HH:MM.
 * @param time
 *  Bool returns an array of millitary time converted into a single minute output.
 * @param min
 * The specified time formatted as integers [hh,mm]
 * @returns {array}
 */
function convertTime(time, min = false){
    if(!time) return []

    const timeArray = time.split(":")

    if(min) {
        return [(Number(timeArray[0])*60)+Number(timeArray[1])]
    }
    return [Number(timeArray[0]),Number(timeArray[1])]
};

module.exports = {
    convertTime
};