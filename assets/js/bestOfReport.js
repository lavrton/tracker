var React = require('./deps/react');

var bestOfReportComponent = React.createClass({
    displayName : 'bestOfReportComponent',
    colors : ['lightcoral', 'yellow', '#CFFF21', '#21FF29'],
    paddings : {
        day : 0,
        week : 10
    },
    findBestOf : function(key) {
        for (var i = 0; i < this.props.bestOfs.length; i++) {
            var item = this.props.bestOfs[i];
            if (item.key === key && item.type === 'day') {
                return item;
            }
        }
    },
    render : function () {
        var createItem = function(bestOf) {
            if (bestOf.type === 'day') {
                return React.DOM.li({
                        key : bestOf.id,
                        style : {
                            'padding-left' : this.paddings[bestOf.type] + 'px',
                            color : this.colors[parseInt(bestOf.score || 1)]
                        }
                    },
                    bestOf.value
                );
            } else if (bestOf.type === 'week') {
                return null;
//                return React.DOM.li({
//                        key : bestOf.id,
//                        style : {
//                            'padding-left' : this.paddings[bestOf.type] + 'px'
//                        }
//                    },
//                    this.findBestOf(bestOf.value).value
//                );
            }
        }.bind(this);
        return React.DOM.table({
                className : 'report-table'
            },
            React.DOM.tr({
                    key : 'header',
                    className : 'table-header'
                },
                React.DOM.td(null, 'Most important:')
            ),
            React.DOM.tr({
                    key : 'body',
                    className : 'table-footer'
                },
                React.DOM.td({
                        key : 'calendar',
                        className : 'table-tr'
                    },
                    React.DOM.ul(null, this.props.bestOfs.sort(function(a , b) {return a.key < b.key}).map(createItem))
                )
            )
        );
    }
});

module.exports = bestOfReportComponent;