/**
 * Formats a time string HH:MM.
 * @param time
 *  
 * The specified time formatted as integers [hh,mm]
 * @returns {array}
 */
function convertTime(time){
    
    if(!time) return []

    const timeArray = time.split(":")

    return [Number(timeArray[0]),Number(timeArray[1])]
};

module.exports = {
    convertTime
};