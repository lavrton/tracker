var React = require('../deps/react');

var BestOfComponent = React.createClass({
    displayName: 'BestOfComponent',
    colors : ['lightcoral', 'yellow', '#CFFF21', '#21FF29'],
    days : ['miserable', 'usual', 'very good', 'awesome!'],
    getInitialState: function() {
        return {
            value : '',
            score : 1
        };
    },
    handleChange : function(event) {
        this.update({value: event.target.value});
    },
    update : function(props) {
        var bestOfItem = this.props.bestOfItem;
        for(var key in props) {
            bestOfItem[key] = props[key];
        }
        this.props.updateBestOf(bestOfItem);
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
                value : this.props.bestOfItem.value,
                onChange : this.handleChange,
                style : {
                    width : '150px'
                }
            }),
            React.DOM.div(null,
                'Day score:'
            ),
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
                value : this.props.bestOfItem.score
            }),
            React.DOM.br(),
            React.DOM.span({
                style : {
                    color : this.colors[this.props.bestOfItem.score]
                }
            }, this.days[this.props.bestOfItem.score])
        );
    }
});

module.exports = BestOfComponent;