var React = require('./deps/react');
var CalHeatMap = require('./deps/cal-heatmap');
var dateFormat = require('./util').dateFormat;

var CalendarWidget = React.createClass({
    displayName: 'CalendarWidget',
    componentDidMount: function () {
        var cal = new CalHeatMap();
        var from = new Date();
        from.setDate(from.getDate() - 30 * 2);
        cal.init({
            itemSelector: this.getDOMNode(),
            domain: "month",
            subDomain : 'day',
            range: 3,
            start: from,
            maxDate : new Date(),
            displayLegend: false,
            highlight: "now",
            data : this.prepareData(this.props.question.answers),
            legend: [1],
            legendColors : {
                min : 'white',
                max : 'green',
                empty : 'white',
                base : 'white'
            }
        });
        this.cal = cal;
    },
    prepareData : function(answers) {
        var obj = {};
        for (var data in answers) {
            obj[(new Date(data).getTime() / 1000).toString()] = answers[data] ? 1 : 0
        }
        return obj;
    },
    shouldComponentUpdate: function(props) {

        this.cal.update(this.prepareData(props.question.answers));
        return false;
    },
    render : function() {
        return React.DOM.div({
            key : this.props.question.id
        });
    }
});

var QuestReport = React.createClass({
    displayName: 'QuestReport',
    calculateLongestStreak : function() {
        var answers = this.props.question.answers || {};
        var answersList = [];
        for (var key in answers) {
            if (answers[key]) {
                answersList.push(key);
            }
        }
        answersList.sort();
        var tempDate = new Date();
        var currentStreak = 0;
        var longestStreak = 0;
        var tempStreak = 0;
        var currentDate;
        var lastDate = new Date(answersList[answersList.length - 2]);
        var calculatingCurrent = true;
        for (var i = answersList.length - 1; i >= 1; i--) {
            currentDate = new Date(answersList[i]);
            tempDate = new Date(currentDate);
            tempDate.setDate(currentDate.getDate() - 1);
            if (dateFormat(tempDate, 'yyyy-mm-dd') === dateFormat(lastDate, 'yyyy-mm-dd')) {
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
            lastDate = new Date(answersList[i - 2]);
        }
        if (longestStreak < tempStreak) {
            longestStreak = tempStreak;
        }
        currentStreak ? currentStreak++ : null;
        longestStreak ? longestStreak++ : null;
        return {
            longestStreak : longestStreak,
            currentStreak : currentStreak
        };
    },

    render : function() {
        var streaks = this.calculateLongestStreak();

        return React.DOM.table({
                key : this.props.question.id,
                className : 'report-table'
            },
            React.DOM.tr({
                    key : 'header',
                    className : 'table-header'
                },
                React.DOM.td({
                    colSpan : 2
                }, this.props.question.title)
            ),
            React.DOM.tr({
                    key : 'body',
                    className : 'table-footer'
                },
                React.DOM.td({
                        key : 'calendar',
                        className : 'table-tr'
                    },
                    CalendarWidget({
                        question : this.props.question
                    })
                ),
                React.DOM.td({
                        key : 'streak',
                        className : 'data-table table-tr'
                    },
                    React.DOM.span({
                        className : 'streak-text'
                    }, 'Current streak:'),
                    React.DOM.br(),
                    React.DOM.span({
                        className : 'streak'
                    }, streaks.currentStreak),
                    React.DOM.br(),
                    React.DOM.span({
                        className : 'streak-text'
                    }, 'Longest streak:'),
                    React.DOM.br(),
                    React.DOM.span({
                        className : 'streak'
                    }, streaks.longestStreak)
                )
            )
        );
    }
});

module.exports = QuestReport;