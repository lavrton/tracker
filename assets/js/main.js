var QuestionList = React.createClass({
    displayName: 'QuestionList',
    render : function() {
        var that = this;
        var createItem = function(question) {
            return AnswerComponent({
                question : question,
                onDelete : that.props.onDelete
            });
        };
        return React.DOM.div(null,
            React.DOM.h2(null, "Your data"),
            React.DOM.ul(null, this.props.questions.map(createItem))
        );
    }
});

var AnswerComponent = React.createClass({
    displayName: 'AnswerComponent',
    onDeleteClick : function () {
        var that = this;
        io.socket.delete('/question', { id : this.props.question.id}, function () {
            that.props.onDelete(that.props.question);
        });
    },
    render : function() {
        var answers = [];
        for (var i = 0; i< 20; i++) {
            answers.push(Math.round(Math.random()) === 1)
        }
        var createButton = function(value) {
            return React.DOM.button({
                    className : 'topcoat-icon-button--quiet'
                },
                React.DOM.span({
                    className : 'topcoat-icon',
                    style : {
                        'background-color' : (value ? '#45F568' : '#A5A7A7')
                    }
                }));
        };

        return React.DOM.li({
                key : this.props.question.id
            },
            answers.map(createButton),
            this.props.question.title + ' ',
            React.DOM.button({
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
        });
    },
    onAdd: function(question) {
        this.state.questions = this.state.questions.concat(question);
        this.setState(this.state);
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
                        onDelete : this.onDelete
                    })
                )
            );
    }
});

var AddQuestion = React.createClass({displayName: 'AddQuestion',
    getInitialState: function() {
        return {value: ''};
    },
    handleChange : function(event) {
        this.setState({value: event.target.value});
    },
    handleAdd : function() {
        var that = this;
        io.socket.post('/question', {title : this.state.value}, function (res) {
            that.props.onAdd(res);
        });
        this.setState({value : ''});
    },
    render: function() {
        return React.DOM.div(null,
            React.DOM.h2(null, "Add question"),
            React.DOM.input({
                type: "text",
                className: "topcoat-text-input question",
                placeholder: "Type your question",
                value : this.state.value,
                onChange : this.handleChange
            }),
            React.DOM.button({
                className: "add-question topcoat-button--cta",
                id : "add-question",
                onClick : this.handleAdd
            }, "Add")
        );
    }
});


React.renderComponent(
    App(),
    document.getElementById('content')
);



