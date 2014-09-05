var React = require('react');
var AnswerComponent = require('./answerComponent');

var QuestionList = React.createClass({
    displayName: 'QuestionList',
    render : function() {
        var that = this;
        var createItem = function(question) {
            return AnswerComponent({
                key : question.id,
                question : question,
                onDelete : that.props.onDelete,
                onAnswersChange : that.props.onAnswersChange
            });
        };
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() - 20);
        var list = [];
        for (var i = 19; i > 0; i--) {
            tempDate.setDate(tempDate.getDate() + 1);
            var key = (tempDate.getMonth() + 1) + '.' + tempDate.getDate();
            list.push(React.DOM.td({
                key : key,
                className : 'date'
            }, key));
        }
        list.push(React.DOM.td({
            key : 'today',
            className : 'date'
        }, 'today'));
        return React.DOM.div({
                key : 'boo'
            },
            React.DOM.h2(null, "Your data"),
            React.DOM.table({
                    className : 'data-table'
                },
                React.DOM.tr(null,
                    list
                ),
                this.props.questions.map(createItem))
        );
    }
});

module.exports = QuestionList;