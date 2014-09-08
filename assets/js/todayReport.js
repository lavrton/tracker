/**
 * Created by lavrton on 05.09.14.
 */

var React = require('react');

var AnswerComponent = React.createClass({
    displayName: 'AnswerComponent',
    handleChange : function(event) {
        var date = this.props.date;
        var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate();
        this.props.question.answers[key] = event.currentTarget.checked;
        this.props.onAnswersChange(this.props.question);
    },
    render : function() {
        var date = this.props.date;
        var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate();
        var checked = this.props.question.answers[key] ? true : false;
        return React.DOM.div({
                style : {
                    display : 'flex',
                    'margin-bottom' : '5px'
                }
            },
            React.DOM.label({
                    className : "topcoat-checkbox"
                },
                React.DOM.input({
                    type : 'checkbox',
                    onChange : this.handleChange,
                    checked : checked
                }),
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

var DateComponent = React.createClass({
    displayName: 'DateComponent',
    render : function() {
        var currentDate = this.props.date;
        var alias = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' +  currentDate.getDate();
        var today = new Date();
        var todayAlias = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' +  today.getDate();
        var displayRightArrow = (alias !== todayAlias);

        if (alias === todayAlias) {
            alias = 'today';
        } else {
            var yesterday = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24);
            var key = yesterday.getFullYear() + '-' + (yesterday.getMonth() + 1) + '-' +  yesterday.getDate();
            if (alias === key) {
                alias = 'yesterday';
            }
        }
        return React.DOM.span(null,
            React.DOM.span({
                className : 'fa fa-arrow-left date-arrow',
                onClick : function() {
                    var yesterday = new Date(this.props.date.getTime() - 1000 * 60 * 60 * 24);
                    this.props.changeDate(yesterday);
                }.bind(this),
                key : 'arrow-left'
            }),
            alias,
            React.DOM.span({
                className : 'fa fa-arrow-right date-arrow',
                style : {
                    display : displayRightArrow ? '' : 'none'
                },
                onClick : function() {
                    var tomorrow = new Date(this.props.date.getTime() + 1000 * 60 * 60 * 24);
                    this.props.changeDate(tomorrow);
                }.bind(this),
                key : 'arrow-right'
            })
        );
    }
});

var TodayReport = React.createClass({
    displayName: 'TodayReport',
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
            React.DOM.span(null, 'Daily track'),
            DateComponent({
                date : this.state.date,
                changeDate : this.changeDate
            }),
            this.props.questions.map(function(question) {
                return AnswerComponent({
                    question : question,
                    onAnswersChange : this.props.onAnswersChange,
                    onDelete : this.props.onDelete,
                    date : this.state.date
                })
            }.bind(this))
        );
    }
});

module.exports = TodayReport;