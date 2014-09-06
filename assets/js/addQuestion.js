var React = require('react');

var AddQuestion = React.createClass({displayName: 'AddQuestion',
    getInitialState: function() {
        return {value: ''};
    },
    handleChange : function(event) {
        this.setState({value: event.target.value});
    },
    handleAdd : function() {
        var that = this;
        io.socket.post('/question', {title : this.state.value, answers : {}}, function (res) {
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
                onChange : this.handleChange,
                onKeyDown : function(e) {
                    if (e.keyCode === 13) {
                        this.handleAdd();
                    }
                }.bind(this)
            }),
            React.DOM.button({
                className: "add-question topcoat-button--cta",
                id : "add-question",
                onClick : this.handleAdd
            }, "Add")
        );
    }
});

module.exports = AddQuestion;

