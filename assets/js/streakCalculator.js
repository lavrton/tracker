var dateFormat = require('./util').dateFormat;

function format(date) {
    return dateFormat(date, 'yyyy-mm-dd');
}

module.exports = function calculate(dateArray, today) {
    if (!today) {
        today = new Date();
    }
    dateArray.sort();
    if (dateArray.length === 1) {
        if (format(dateArray[0]) === format(today)) {
            return {
                longestStreak : 1,
                currentStreak : 1
            }
        } else {
            var dayBefore = today;
            dayBefore.setDate(dayBefore.getDate() - 1);
            if (format(dateArray[0]) === format(dayBefore)) {
                return {
                    longestStreak : 1,
                    currentStreak : 1
                };
            } else {
                return {
                    longestStreak : 1,
                    currentStreak : 0
                };
            }
        }
    }
    var tempDate = today;
    var currentStreak = 0;
    var longestStreak = 0;
    var tempStreak = 0;
    var currentDate;
    var lastDate = new Date(dateArray[dateArray.length - 2]);
    var calculatingCurrent = true;
    for (var i = dateArray.length - 1; i >= 1; i--) {
        currentDate = new Date(dateArray[i]);

        tempDate = new Date(currentDate);
        tempDate.setDate(currentDate.getDate() - 1);
        if (format(tempDate) === format(lastDate)) {
            if (calculatingCurrent) {
                currentStreak +=1;
            }
            tempStreak +=1;
        } else {
            calculatingCurrent = false;
            if (longestStreak < tempStreak) {
                longestStreak = tempStreak;
                tempStreak = 0;
            }
        }
        lastDate = new Date(dateArray[i - 2]);
    }
    if (longestStreak < tempStreak) {
        longestStreak = tempStreak;
    }
    currentStreak ? currentStreak++ : null;
    longestStreak ? longestStreak++ : null;
    var dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 1);
    if (dateArray.indexOf(format(today)) === -1 && dateArray.indexOf(format(dayBefore)) === -1) {
        currentStreak = 0;
    }
    if (dateArray.indexOf(format(today)) !== -1 && dateArray.indexOf(format(dayBefore)) === -1) {
        currentStreak = 1;
    }
    var dayBeforeBefore = new Date(dayBefore);
    dayBeforeBefore.setDate(dayBeforeBefore.getDate() - 1);
    if (dateArray.indexOf(format(today)) === -1
        && dateArray.indexOf(format(dayBefore)) !== -1
        && dateArray.indexOf(format(dayBeforeBefore)) === -1) {
        currentStreak = 1;
    }

    return {
        longestStreak : longestStreak,
        currentStreak : currentStreak
    };
};