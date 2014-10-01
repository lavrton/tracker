var React = require('./deps/react');

var AddQuestion = require('./addQuestion');
var QuestionList = require('./questionList');
var DailyQuestSubmit = require('./dailySubmit/dailyQuestSubmit');
var LoginComponent = require('./loginComponent');

var dateFormat = require('./util').dateFormat;

var App = React.createClass({
    getInitialState: function() {
        return {
            questions: [],
            bestOf : []
        };
    },
    setupQuestionConnection : function() {
        var that = this;
        io.socket.get('/question', function (data) {
            data.forEach(function(quest) {
                var newAnswers = {};
                for (var key in quest.answers) {
                    var date = new Date(key);
                    var newKey = dateFormat(date, 'yyyy-mm-dd');
                    if (quest.answers[key]) {
                        newAnswers[newKey] = true;
                    }
                }
                quest.answers = newAnswers;
            });
            var state = React.addons.update(that.state, {
                $merge : {
                    questions : data
                }
            });
            that.setState(state);
        });
        io.socket.get('/question/subscribe');
        io.socket.on('question', function (res) {
            if (res.verb && res.verb === 'created') {
                that.onQuestionAdd(res.data);
            }
            if (res.verb && res.verb === 'destroyed') {
                for (var i = 0; i < that.state.questions.length; i++) {
                    var question = that.state.questions[i];
                    if (question.id === res.id) {
                        that.onQuestionDelete(question);
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
    setupBestOfConnection : function() {
        var that = this;
        io.socket.get('/bestOf', function (data) {
            var state = React.addons.update(that.state, {
                $merge : {
                    bestOf : data
                }
            });
            that.setState(state);
        });
        io.socket.get('/bestOf/subscribe');
        io.socket.on('bestOf', function (res) {
            if (res.verb && res.verb === 'created') {
                that.addBestOfItem(res.data);
            }
            if (res.verb && res.verb === 'destroyed') {
                for (var i = 0; i < that.state.bestOf.length; i++) {
                    var bestOf = that.state.bestOf[i];
                    if (bestOf.id === res.id) {
                        that.onBestOfDelete(bestOf);
                        break;
                    }
                }
            }
            if (res.verb && res.verb === 'updated') {
                for (var i = 0; i < that.state.bestOf.length; i++) {
                    var bestOf = that.state.bestOf[i];
                    if (bestOf.id === res.data.id) {
                        that.state.bestOf[i] = res.data;
                        that.setState(that.state);
                        break;
                    }
                }
            };
        });
    },
    componentDidMount: function() {
        this.setupQuestionConnection();
        this.setupBestOfConnection();
    },
    onQuestionAdd: function(question) {
        question.id = 'fake' + Math.random();
        io.socket.post('/question/create', question, function (res) {
            if (res.error) {
                console.error(res.error);
            }
            question.id = res.id;
        });
        var questions = this.state.questions.concat(question);
        var state = React.addons.update(this.state, {
            $merge : {questions : questions}
        });
        this.setState(state);
    },
    onQuestionDelete : function(question) {
        io.socket.get('/question/destroy/' + question.id, function (res) {
            if (res.error) {
                console.error(res.error);
            }
        });
        var index = this.state.questions.indexOf(question);
        if (index > -1) {
            var questions = React.addons.update(this.state.questions, {
                $splice : [[index, 1]]
            });
            var state = React.addons.update(this.state, {
                $merge : {questions : questions}
            });
            this.setState(state)
        } else {
            throw "Can't delete question from state. Has no such question."
        }
    },
    addBestOfItem: function(bestOfItem) {
        io.socket.post('/bestOf/create', bestOfItem, function (res) {
            if (res.error) {
                console.error(res.error);
            }
            for(var i = 0; i < this.state.bestOf.length; i++) {
                var bestOfItem = this.state.bestOf[i];
                if (bestOfItem.key === res.key && bestOfItem.type === res.type) {
                    this.state.bestOf[i].id = res.id;
                    break;
                }
            }
            var state = React.addons.update(this.state, {
                $merge : {
                    bestOf : this.state.bestOf
                }
            });
            this.setState(state);
        }.bind(this));
        bestOfItem.id = 'fakeId';
        var bestOf = this.state.bestOf.concat([bestOfItem]);
        var state = React.addons.update(this.state, {
            $merge : {bestOf : bestOf}
        });
        this.setState(state);
    },
    updateBestOf: function(bestOfItem) {
        if (!bestOfItem.id) {
            this.addBestOfItem(bestOfItem);
            return;
        }
        if (bestOfItem.id === 'fakeId') {
            return;
        }
        io.socket.put('/bestOf/' + bestOfItem.id, bestOfItem, function (res) {
            if (res.error) {
                console.error(res.error);
            }
        });
        for(var i = 0; i < this.state.bestOf.length; i++) {
            if (this.state.bestOf[i].id === bestOfItem.id) {
                this.state.bestOf[i] = bestOfItem;
                break;
            }
        }
        var state = React.addons.update(this.state, {
            $merge : {
                bestOf : this.state.bestOf
            }
        });
        this.setState(state);
    },
    onBestOfDelete : function(bestOfItem) {
        io.socket.get('/bestOf/destroy/' + bestOfItem.id, function (res) {
            if (res.error) {
                console.error(res.error);
            }
        });
        var index = this.state.bestOf.indexOf(bestOfItem);
        if (index > -1) {
            var bestOf = React.addons.update(this.state.bestOf, {
                $splice : [[index, 1]]
            });
            var state = React.addons.update(this.state, {
                $merge : {bestOf : bestOf}
            });
            this.setState(state)
        } else {
            throw "Can't delete bestOf from state. Has no such question."
        }
    },
    onAnswersChange : function(question) {
        io.socket.put('/question/'+question.id, question, function (res) {
            if (res.error) {
                console.error(res.error);
            }
        });
        var state = React.addons.update(this.state, {
            $set : {
                questions : this.state.questions
            }
        });
        this.setState(state);
    },
    render: function() {
        return React.DOM.div(null,
                React.DOM.div({
                        className : 'grid-25'
                    },
                    DailyQuestSubmit({
                        questions : this.state.questions,
                        bestOf : this.state.bestOf,
                        onDelete : this.onQuestionDelete,
                        onAnswersChange : this.onAnswersChange,
                        updateBestOf : this.updateBestOf
                    }),
                    AddQuestion({onAdd : this.onQuestionAdd})
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


if (window.user.logged) {
    React.renderComponent(
        App(),
        document.getElementById('content')
    );
} else {
    // hide logout button
    document.getElementById('logoutButton').style.display ='';

    React.renderComponent(
        LoginComponent(),
        document.getElementById('loginContainer')
    );
}

