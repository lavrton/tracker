var React = require('react/addons');
var AddQuestion = require('./addQuestion');
var QuestionList = require('./questionList');

var App = React.createClass({
    getInitialState: function() {
        return {
            questions: []
        };
    },
    componentDidMount: function() {
        var that = this;
        io.socket.get('/question', function (data) {
            that.setState({questions : data});
        });
        io.socket.get('/question/subscribe');
        io.socket.on('question', function (res) {
            if (res.verb && res.verb === 'created') {
                that.onAdd(res.data);
            }
            if (res.verb && res.verb === 'destroyed') {
                for (var i = 0; i < that.state.questions.length; i++) {
                    var question = that.state.questions[i];
                    if (question.id === res.id) {
                        that.onDelete(question);
                        break;
                    }
                }
            }
            if (res.verb && res.verb === 'updated') {
                for (var i = 0; i < that.state.questions.length; i++) {
                    var question = that.state.questions[i];

                    if (question.id === res.data.id) {
                        that.state.questions[i] = res.data;
                        that.setState(that.state);
                        break;
                    }
                }
            };
        });
    },
    onAdd: function(question) {
        var questions = this.state.questions.concat(question);
        var state = React.addons.update(this.state, {
            $merge : {questions : questions}
        });
        this.setState(state);
    },
    onDelete : function(question) {
        var index = this.state.questions.indexOf(question);
        if (index > -1) {
            this.state.questions.splice(index, 1);
        } else {
            throw "Can't delete question from state. Has no such question."
        }
        this.setState(this.state);
    },
    onAnswersChange : function(question) {
        io.socket.put('/question/'+question.id, question, function (res) {
            this.setState(this.state);
        }.bind(this));
    },
    render: function() {
        return React.DOM.div(null,
                React.DOM.div({
                        className : 'grid-25'
                    },
                    AddQuestion({onAdd : this.onAdd})
                ),
                React.DOM.div({
                        className : 'grid-75'
                    },
                    QuestionList({
                        questions : this.state.questions,
                        onDelete : this.onDelete,
                        onAnswersChange : this.onAnswersChange
                    })
                )
            );
    }
});


React.renderComponent(
    App(),
    document.getElementById('content')
);



