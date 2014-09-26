var React = require('react');
var dateFormat = require('../util').dateFormat;

var BestOfComponent = React.createClass({
    displayName: 'BestOfComponent',
    colors : ['darkred', 'yellow', 'green','darkgreen'],
    getInitialState: function() {
        return {
            value : '',
            score : 1
        };
    },
    componentWillReceiveProps : function(newProps) {
        console.log('new display', newProps);
        var currentBestOfItem = this.getCurrentBestOfItem(newProps);
        console.log('new state', JSON.stringify(currentBestOfItem));
        this.setState(currentBestOfItem);
    },
    handleChange : function(event) {
        this.update({value: event.target.value});
    },
    update : function(props) {
//        console.log
        var bestOfItem = this.state;
        for(var key in props) {
            bestOfItem[key] = props[key];
        }
        console.log('updare request', JSON.stringify(bestOfItem));
        this.props.updateBestOf(bestOfItem);
    },
    handleRangeChange : function(evt) {
        this.update({
            score : parseInt(evt.target.value)
        });
    },
    getCurrentBestOfItem : function(props) {
        var key = dateFormat(props.date, 'yyyy-mm-dd');
        console.log(key);
        var currentBestOf = {
            key : key,
            type : 'day',
            value : '',
            score : 1
        };
        props.bestOf.forEach(function(bestOfItem) {
            if (bestOfItem.key === key && bestOfItem.type === 'day') {
                currentBestOf = bestOfItem;
            }
        });
        return currentBestOf;
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
            React.DOM.br()
//            React.DOM.button({
//                className: "add-question topcoat-button--cta",
//                id : "submit-bestOf",
//                onClick : this.handleSubmit,
//                style : {
//                    'background-color' : this.colors[this.state.score],
//                    'color' : this.state.score === 1 ? 'black' : ''
//                }
//            }, "Submit")
        );
    }
});

module.exports = BestOfComponent;