var React = require('react');

var AnswerComponent = React.createClass({
    displayName: 'AnswerComponent',
    handleChange : function(event) {
        var date = this.props.date;
        var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate();
        this.props.question.answers[key] = event.currentTarget.checked;
        this.props.onAnswersChange(this.props.question);
    },
    render : function() {
        var date = this.props.date;
        var key = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate();
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
                    this.props.onDelete(this.props.question);
                }.bind(this)
            })
        );
    }
});

module.exports = AnswerComponent;