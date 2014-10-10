var expect = require("chai").expect;
var streakCalculator = require('../assets/js/streakCalculator');

describe("streak calculation", function() {
    it("find streak with one old chain", function(){
        expect(streakCalculator(['2014-09-10'])).to.eql({
            currentStreak : 0,
            longestStreak : 1
        });
    });
    it("if one chain done today", function(){
        expect(streakCalculator(['2014-09-10'], new Date('2014-09-10'))).to.eql({
            currentStreak : 1,
            longestStreak : 1
        });
    });

    it.only("if many chains done yesterday", function(){
        expect(streakCalculator(['2014-09-08','2014-09-09'], new Date('2014-09-10'))).to.eql({
            currentStreak : 2,
            longestStreak : 2
        });
    });

    it("if many chains done long day ago", function(){
        expect(streakCalculator(['2014-09-13', '2014-09-14', '2014-09-15'])).to.eql({
            currentStreak : 0,
            longestStreak : 3
        });
    });

    it("if no chains", function(){
        expect(streakCalculator([])).to.eql({
            currentStreak : 0,
            longestStreak : 0
        });
    });
});