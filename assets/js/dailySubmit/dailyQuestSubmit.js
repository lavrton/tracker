var React = require('../deps/react');
var DateComponent = require('./date');
var AnswerComponent = require('./answer');
var BestOfComponent = require('./bestOf');
var dateFormat = require('../util').dateFormat;


function getWeek(date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

var DailyQuestSubmit = React.createClass({
    displayName: 'DailyQuestSubmit',
    getInitialState : function() {
        return {
            date : new Date()
        }
    },
    changeDate : function(newDate) {
        var state = React.addons.update(this.state, {
            $merge : {
                date : newDate
            }
        });
        this.setState(state);
    },
    findBestOf : function(key) {
        var currentBestOf;
        this.props.bestOf.forEach(function(bestOfItem) {
            if (bestOfItem.key === key && bestOfItem.type === 'day') {
                currentBestOf = bestOfItem;
            }
        });
        return currentBestOf;
    },
    getLoosedBestOfDates : function() {
        if (this.props.bestOf.length === 0) {
            return [];
        }
        var firstBestOf = this.props.bestOf[0];
        var loosedDates = [];
        this.props.bestOf.forEach(function(bestOfItem) {
            if (bestOfItem.type === 'day' && new Date(bestOfItem.key) < new Date(firstBestOf.key)) {
                firstBestOf = bestOfItem;
            }
        });
        var dateForChecking = new Date(firstBestOf.key);
        var today = new Date();
        while(dateForChecking.toDateString() !== today.toDateString()) {
            dateForChecking.setDate(dateForChecking.getDate() + 1);
            var key = dateFormat(dateForChecking, 'yyyy-mm-dd');
            if (!this.findBestOf(key)) {
                loosedDates.push(new Date(dateForChecking));
            }
        }
        return loosedDates;
    },
    weeklyChoose : function() {
        var lastMonthDay = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 0);
        var chooses = [];
        var date = new Date(this.state.date);
        if (this.state.date.getDay() === 0 || this.state.date.toDateString() === lastMonthDay.toDateString()) {
            var bestOfItem = this.findBestOf(dateFormat(this.state.date, 'yyyy-mm-dd'));
            if (bestOfItem) {
                chooses.unshift(bestOfItem);
            }
            while (true) {
                date.setDate(date.getDate() - 1);
                if (date.getDay() !== 0 && this.state.date.getMonth() === date.getMonth()) {
                    bestOfItem = this.findBestOf(dateFormat(date, 'yyyy-mm-dd'))
                    if (bestOfItem) {
                        chooses.unshift(bestOfItem);
                    }
                } else {
                    break;
                }
            }
        }
        return chooses;
    },
    submitWeekly: function(bestOfItem, chooses) {
        var date = new Date(bestOfItem.key);
        if (date.getDay() === 0) {
            date.setDate(date.getDate() - 6);
        } else {
            date.setDate(date.getDate() - (date.getDay() - 1));
        }
        var key = dateFormat(this.state.date, 'yyyy-mm-dd');
        var score = chooses.reduce(function(bestOfItem) {
            return bestOfItem.score;
        }) / chooses.length;
        var bestOf = {
            key : key,
            value : bestOfItem.value,
            score : score
        };
        this.props.updateBestOf();
    },
    render : function() {
        var key = dateFormat(this.state.date, 'yyyy-mm-dd');
        var bestOfItem = this.findBestOf(key)
            ||
        {
            key : key,
            type : 'day',
            value : '',
            score : 1
        };
        var loosedBestOfDates = this.getLoosedBestOfDates();
        var chooses = this.weeklyChoose();
        var that = this;
        return React.DOM.div({
                className : 'side-widget'
            },
            React.DOM.span({
            }, 'Daily track'),
            DateComponent({
                date : this.state.date,
                changeDate : this.changeDate
            }),
            React.DOM.br(),
            React.DOM.span({
            }, 'Loosed days:'),
            React.DOM.ul({},
                loosedBestOfDates.map(function(loosedDate) {
                    return React.DOM.li({
                        key : loosedDate.toDateString(),
                        onClick : function() {
                            that.changeDate(loosedDate);
                        }
                    }, loosedDate.toDateString())
                })
            ),
            this.props.questions.map(function(question) {
                return AnswerComponent({
                    key : question.id,
                    question : question,
                    onAnswersChange : this.props.onAnswersChange,
                    onDelete : this.props.onDelete,
                    date : this.state.date
                })
            }.bind(this)),
            React.DOM.hr({
                size : 1,
                color : 'grey'
            }),
            BestOfComponent({
                date : this.state.date,
                bestOfItem : bestOfItem,
                updateBestOf : this.props.updateBestOf
            }),
            chooses ? chooses.map(function(bestOfItem) {
                return React.DOM.div({
                        key : bestOfItem.id
                    },
                    React.DOM.label({
                            className : 'topcoat-radio-button',
                            onClick: function() {
                                that.submitWeekly(bestOfItem, chooses);
                            }
                        },
                        React.DOM.input({
                            type : 'radio',
                            name : 'topcoat'
                        }),
                        React.DOM.div({
                            className : 'topcoat-radio-button__checkmark'
                        }),
                        ' ' + bestOfItem.value
                    )
                )
            }) : null
        );
    }
});

module.exports = DailyQuestSubmit;