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

    it("if many chains done yesterday", function(){
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

    it("separate chains", function(){
        expect(streakCalculator(['2014-09-13', '2014-09-14', '2014-09-15', '2014-10-08', '2014-10-09'], new Date('2014-10-10'))).to.eql({
            currentStreak : 2,
            longestStreak : 3
        });
    });

    it("separate chains 2", function(){
        expect(streakCalculator(['2014-09-23', '2014-09-24', '2014-09-25', '2014-09-26', '2014-09-27',
            '2014-09-28', '2014-09-29','2014-09-30', '2014-10-01', '2014-10-02', '2014-10-03', '2014-10-04',
            '2014-10-07', '2014-10-08', '2014-10-10'], new Date('2014-10-11'))).to.eql({
            currentStreak : 1,
            longestStreak : 12
        });
    });
});