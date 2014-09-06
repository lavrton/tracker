/**
 * Created by lavrton on 05.09.14.
 */

var React = require('react');

var AnswerComponent = React.createClass({
    displayName: 'AnswerComponent',
    handleChange : function(event) {
        var date = new Date();
        var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate();
        this.props.question.answers[key] = event.currentTarget.checked;
        this.props.onAnswersChange(this.props.question);
    },
    render : function() {
        return React.DOM.div({
                style : {
                    display : 'flex'
                }
            },
                React.DOM.label({
                        className : "topcoat-checkbox"
                    },
                    React.DOM.input({type : 'checkbox', onChange : this.handleChange}),
                    React.DOM.div({
                            className : 'topcoat-checkbox__checkmark'
                        }
                    ),
                    ' ' + this.props.question.title + ' '
                ),
                React.DOM.span({
                    className : 'fa fa-remove',
                    style : {
                        color : '#B05858',
                        'margin-left' : '10px'
                    },
                    onClick : function() {
                        this.props.onDelete(this.props.question);
                    }.bind(this)
                })
            );
    }
});

var TodayReport = React.createClass({
    displayName: 'TodayReport',
    render : function() {
        return React.DOM.div(null,
            React.DOM.h2(null, 'Daily track'),
            this.props.questions.map(function(question) {
                return AnswerComponent({
                    question : question,
                    onAnswersChange : this.props.onAnswersChange,
                    onDelete : this.props.onDelete
                })
            }.bind(this))
        );
    }
});

module.exports = TodayReport;