var QuestionList = React.createClass({
    render : function() {
        var createItem = function(question) {
            return React.DOM.li({key : question.id}, question.title);
        };
        return React.DOM.ul(null, this.props.questions.map(createItem));
    }
});

var App = React.createClass({
    getInitialState: function() {
        return {questions: []};
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
    render: function() {
        return React.DOM.div(null,
                AddQuestion({onAdd : this.onAdd}),
                QuestionList({questions : this.state.questions})
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
    document.getElementById('questions')
);



