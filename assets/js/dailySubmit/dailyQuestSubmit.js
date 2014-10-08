var React = require('../deps/react');
var DateComponent = require('./date');
var AnswerComponent = require('./answer');
//var BestOfComponent = require('./bestOf');
var PurposeComponent = require('./purpose');
var dateFormat = require('../util').dateFormat;

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
        this.props.bestOfs.forEach(function(bestOfItem) {
            if (bestOfItem.key === key && bestOfItem.type === 'day') {
                currentBestOf = bestOfItem;
            }
        });
        return currentBestOf;
    },
    getLoosedBestOfDates : function() {
        if (this.props.bestOfs.length === 0) {
            return [];
        }
        var firstBestOf = this.props.bestOfs[0];
        var loosedDates = [];
        this.props.bestOfs.forEach(function(bestOfItem) {
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
    getCurrentPurpose : function() {
        for(var i in this.props.purposes) {
            var purpose = this.props.purposes[i];
            if (purpose.key === dateFormat(this.state.date, 'yyyy-mm-dd')) {
                return purpose
            }
        }
        return {
            key : dateFormat(this.state.date, 'yyyy-mm-dd'),
            items : []
        }
    },
    render : function() {
//        var key = dateFormat(this.state.date, 'yyyy-mm-dd');
//        var bestOfItem = this.findBestOf(key)
//            ||
//        {
//            key : key,
//            type : 'day',
//            value : '',
//            score : 1
//        };
//        var loosedBestOfDates = this.getLoosedBestOfDates();
//        var that = this;

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
//            React.DOM.div({
//                    className : 'center'
//                },
//                'Loosed days:',
//                React.DOM.ul({
//                    className : 'center'
//                    },
//                    loosedBestOfDates.map(function(loosedDate) {
//                        return React.DOM.li({
//                            key : loosedDate.toDateString(),
//                            onClick : function() {
//                                that.changeDate(loosedDate);
//                            }
//                        }, loosedDate.toDateString())
//                    })
//                )
//            ),
            PurposeComponent({
                purpose : this.getCurrentPurpose(),
                updatePurpose : this.props.updatePurpose,
                date : this.state.date
            }),
            React.DOM.div({
                    style : {
                        'margin-top' : '10px'
                    }
                },
                React.DOM.div({
                    style : {
                        'text-align' : 'center'
                    }
                }, 'Chains:'),
                this.props.questions.map(function(question) {
                    return AnswerComponent({
                        key : question.id,
                        question : question,
                        updateQuestion : this.props.updateQuestion,
                        removeQuestion : this.props.removeQuestion,
                        date : this.state.date
                    })
                }.bind(this))
            )


//            React.DOM.hr({
//                size : 1,
//                color : 'grey'
//            }),
//            BestOfComponent({
//                date : this.state.date,
//                bestOfItem : bestOfItem,
//                bestOfs : this.props.bestOfs,
//                updateBestOf : this.props.updateBestOf
//            })
        );
    }
});

module.exports = DailyQuestSubmit;