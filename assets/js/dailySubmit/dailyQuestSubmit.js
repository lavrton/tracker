var React = require('react');
var DateComponent = require('./date');
var AnswerComponent = require('./answer');
var BestOfComponent = require('./bestOf');

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
    render : function() {
        return React.DOM.div({
                className : 'side-widget'
            },
            React.DOM.span({
            }, 'Daily track'),
            DateComponent({
                date : this.state.date,
                changeDate : this.changeDate
            }),
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
                submitBestOf : this.props.submitBestOf
            })
        );
    }
});

module.exports = DailyQuestSubmit;