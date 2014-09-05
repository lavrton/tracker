/**
 * Created by lavrton on 04.09.14.
 */

var React = require('react');



var AnswerComponent = React.createClass({
    displayName: 'AnswerComponent',
    onDeleteClick : function () {
        var that = this;
        io.socket.delete('/question', { id : this.props.question.id}, function () {
            that.props.onDelete(that.props.question);
        });
    },
    calculateCurrentStreak : function() {
        var answers = this.props.question.answers || {};
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() + 1);
        var streak = 0;
        for (var i = 20; i > 0; i--) {
            tempDate.setDate(tempDate.getDate() - 1);
            var key = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' +  tempDate.getDate();
            if (answers[key]) {
                streak +=1;
            } else {
                break
            }
        }
        return streak;
    },
    render : function() {
        this.props.question.answers = this.props.question.answers || {};
        var answers = this.props.question.answers || {};
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - 20);
        var list = [];
        for (var i = 20; i > 0; i--) {
            tempDate.setDate(tempDate.getDate() + 1);
            var key = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' +  tempDate.getDate();
            var val = {
                date : key,
                value : answers[key] ? true : false
            };
            list.push(val);
        }
        var streak = this.calculateCurrentStreak();
        var createButton = function(answear) {
            var lastValue = answear.value;
            return React.DOM.td({
                    key : this.props.question.id+'-'+answear.date
                },
                React.DOM.button({
                    className : 'topcoat-icon-button--quiet',
                    onClick: function() {
                        lastValue = !lastValue;
                        this.props.question.answers[answear.date] = lastValue;
                        this.props.onAnswersChange(this.props.question);
                    }.bind(this)
                },
                React.DOM.span({
                    className : 'topcoat-icon',
                    style : {
                        'background-color' : (answear.value ? '#45F568' : '#A5A7A7')
                    }
                }))
            );
        }.bind(this);


        return React.DOM.tr({
                key : this.props.question.id
            },
            list.map(createButton),
            React.DOM.td({key : 'title'}, this.props.question.title + ' streak:' + streak + ' '),
            React.DOM.td({key : 'delete'},
                React.DOM.button({
                        key : Math.random(),
                        className : 'topcoat-icon-button',
                        onClick : this.onDeleteClick
                    },
                    React.DOM.span({
                        style : {
                            'color' : '#F23F3F'
                        }
                    }, 'delete')
                )
            )
        );
    }
});

module.exports = AnswerComponent;