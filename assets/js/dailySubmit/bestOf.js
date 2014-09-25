var React = require('react');

var BestOfComponent = React.createClass({
    displayName: 'BestOfComponent',
    colors : ['darkred', 'yellow', 'green','darkgreen'],
    getInitialState: function() {
        return {
            value: '',
            score : 1
        };
    },
    handleChange : function(event) {
        this.update({value: event.target.value});
    },
    handleSubmit : function() {
        this.props.submitBestOf({
            type : 'day',
            date : this.props.date,
            value : this.state.value,
            score : this.state.score
        });
    },
    update : function(props) {
        var state = React.addons.update(this.state, {
            $merge : props
        });
        this.setState(state);
    },
    handleRangeChange : function(evt) {
        this.update({
            score : parseInt(evt.target.value)
        });
    },
    render : function() {
        return React.DOM.div({
                style : {
                    'text-align' : 'center'
                }
            },
            React.DOM.div(null,
                'Important event of the day:'
            ),
            React.DOM.input({
                type: "text",
                className: "topcoat-text-input",
                placeholder: "",
                value : this.state.value,
                onChange : this.handleChange,
                onKeyDown : function(e) {
                    if (e.keyCode === 13) {
                        this.handleSubmit();
                    }
                }.bind(this),
                style : {
                    width : '150px'
                }
            }),
            React.DOM.div({
                    style : {
                        color : 'lightcoral'
                    }
                },
                'Day score:'
            ),
            React.DOM.span(null, 'miserable'),
            React.DOM.input({
                type: "range",
                className: "topcoat-range",
                onChange : this.handleRangeChange,
                min : 0,
                max : 3,
                step : 1,
                style : {
                    margin : '7px 7px 10px 7px',
                    width : '70px'
                },
                value : this.state.score
            }),
            React.DOM.span({
                style : {
                    color : 'lightgreen'
                }
            }, 'awesome'),
            React.DOM.br(),
            React.DOM.button({
                className: "add-question topcoat-button--cta",
                id : "submit-bestOf",
                onClick : this.handleSubmit,
                style : {
                    'background-color' : this.colors[this.state.score],
                    'color' : this.state.score === 1 ? 'black' : ''
                }
            }, "Submit")
        );
    }
});

module.exports = BestOfComponent;