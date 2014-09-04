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
    render : function() {
        this.props.question.answers = this.props.question.answers || {};
        var answers = this.props.question.answers || {};
        console.log(answers);
        var tempDate = new Date();
        var list = [];
        for (var i = 20; i > 0; i--) {
            tempDate.setDate(tempDate.getDate() - i);
            var key = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' +  tempDate.getDay();
            var val = {
                date : key,
                value : answers[key] ? true : false
            };
            list.push(val);
        }
        var createButton = function(answear) {
            var lastValue = answear.value;
            return React.DOM.button({
                    key : Math.random(),
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
                }));
        }.bind(this);

        return React.DOM.li({
                key : this.props.question.id
            },
            list.map(createButton),
            this.props.question.title + ' ',
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
        );
    }
});

module.exports = AnswerComponent;