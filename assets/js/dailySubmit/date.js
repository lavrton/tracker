var React = require('react');

var DateComponent = React.createClass({
    displayName: 'DateComponent',
    render : function() {
        var currentDate = this.props.date;
        var alias = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' +  currentDate.getDate();
        var today = new Date();
        var todayAlias = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' +  today.getDate();
        var displayRightArrow = (alias !== todayAlias);

        if (alias === todayAlias) {
            alias = 'today';
        } else {
            var yesterday = new Date((new Date()).getTime() - 1000 * 60 * 60 * 24);
            var key = yesterday.getFullYear() + '-' + (yesterday.getMonth() + 1) + '-' +  yesterday.getDate();
            if (alias === key) {
                alias = 'yesterday';
            }
        }
        return React.DOM.span(null,
            React.DOM.span({
                className : 'fa fa-arrow-left date-arrow',
                onClick : function() {
                    var yesterday = new Date(this.props.date.getTime() - 1000 * 60 * 60 * 24);
                    this.props.changeDate(yesterday);
                }.bind(this),
                key : 'arrow-left'
            }),
            alias,
            React.DOM.span({
                className : 'fa fa-arrow-right date-arrow',
                style : {
                    display : displayRightArrow ? '' : 'none'
                },
                onClick : function() {
                    var tomorrow = new Date(this.props.date.getTime() + 1000 * 60 * 60 * 24);
                    this.props.changeDate(tomorrow);
                }.bind(this),
                key : 'arrow-right'
            })
        );
    }
});

module.exports = DateComponent;