var QuestionList = React.createClass({
    render : function() {
        var createItem = function(question) {
            return React.DOM.li(null, question.title);
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
    },
    onAdd: function(questionTitle) {
        this.state.questions = this.state.questions.concat([{
            title : questionTitle
        }]);
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
        this.props.onAdd(this.state.value);
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



