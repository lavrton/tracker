var React = require('../deps/react');
var dateFormat = require('../util').dateFormat;

var AnswerComponent = React.createClass({
    displayName: 'AnswerComponent',
    handleChange : function(event) {
        var date = this.props.date;
        var key = dateFormat(date, 'yyyy-mm-dd');
        this.props.question.answers[key] = event.currentTarget.checked;
        this.props.updateQuestion(this.props.question);
    },
    render : function() {
        var date = this.props.date;
        var key = dateFormat(date, 'yyyy-mm-dd');
        var checked = this.props.question.answers[key] ? true : false;
        return React.DOM.div({
                style : {
                    display : 'flex',
                    'margin-bottom' : '5px'
                }
            },
            React.DOM.label({
                    className : "topcoat-checkbox"
                },
                React.DOM.input({
                    type : 'checkbox',
                    onChange : this.handleChange,
                    checked : checked
                }),
                React.DOM.div({
                        className : 'topcoat-checkbox__checkmark'
                    }
                ),
                    ' ' + this.props.question.title + ' '
            ),
            React.DOM.span({
                className : 'fa fa-remove',
                style : {
                    color : '#B05858',
                    'margin-left' : '10px'
                },
                onClick : function() {
                    this.props.removeQuestion(this.props.question);
                }.bind(this)
            })
        );
    }
});

module.exports = AnswerComponent;