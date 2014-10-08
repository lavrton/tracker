var React = require('../deps/react');
var dateFormat = require('../util').dateFormat;

var PurposeComponent = React.createClass({
    displayName: 'PurposeComponent',
    getInitialState : function() {
        return {
            hidePurposes : true
        }
    },
    getList : function() {
//        var list = [];
        // clean items
//        for (var i in this.props.purpose.items) {
//            var item = this.props.purpose.items[i];
//            if (item) {
//                list.push(item);
//            }
//        }
        // then add empty
        return this.props.purpose.items.concat(['']);
    },
    render : function() {
        var date = this.props.date;
        var that = this;
        var list = this.getList();
        return React.DOM.div({
                className : 'center',
                style : {
                    'margin-top' : '10px'
                }
            },
            React.DOM.span({
                onClick : function() {
                    if (date.toDateString() !== new Date().toDateString()) {
                        var state = {
                            hidePurposes : !this.state.hidePurposes
                        };
                        this.setState(state);
                    }
                }.bind(this)
            }, date.toDateString() !== new Date().toDateString() && this.state.hidePurposes ? 'Show purposes >' : 'Purposes:'),
            React.DOM.br(),
            React.DOM.ul({
                    style : {
                        padding : '0',
                        margin : '0',
                        display : date.toDateString() !== new Date().toDateString() && this.state.hidePurposes ? 'none' : ''
                    }
                },
                list.map(function(item, index) {
                    return React.DOM.li({
                            key : that.props.purpose.key + index,
                            style : {
                                margin : '2px'
                            }
                        },
                        React.DOM.input({
                            style : {
                                width : '100%'
                            },
                            className : 'topcoat-text-input',
                            value : item,
                            onChange : function(e) {
                                that.props.purpose.items[index] = e.target.value;
                                that.props.updatePurpose(that.props.purpose);
                            }
                        }),
                        React.DOM.br()
                    )
                })
            )
        );
    }
});

module.exports = PurposeComponent;