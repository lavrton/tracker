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
        return React.DOM.div({
                key : 'boo'
            },
            React.DOM.h2(null, "Your data"),
            React.DOM.ul(null, this.props.questions.map(createItem))
        );
    }
});

module.exports = QuestionList;