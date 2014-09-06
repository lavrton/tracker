/**
 * Created by lavrton on 04.09.14.
 */

var React = require('react');
var CalHeatMap = require('./dependencies/cal-heatmap');

var CalendarWidget = React.createClass({
    displayName: 'CalendarWidget',
    componentDidMount: function () {
        var cal = new CalHeatMap();
        var from = new Date();
        from.setDate(from.getDate() - 30 * 2);
        cal.init({
            itemSelector: this.getDOMNode(),
            domain: "month",
            subDomain : 'day',
            range: 3,
            start: from,
            maxDate : new Date(),
            displayLegend: false,
            highlight: "now",
            data : this.prepareData(this.props.question.answers),
            legend: [1],
            legendColors : {
                min : 'white',
                max : 'green',
                empty : 'white',
                base : 'white'
            }
        });
        this.cal = cal;
    },
    prepareData : function(answers) {
        var obj = {};
        for (var data in answers) {
            obj[(new Date(data).getTime() / 1000).toString()] = answers[data] ? 1 : 0
        }
        return obj;
    },
    shouldComponentUpdate: function(props) {

        this.cal.update(this.prepareData(props.question.answers));
        return false;
    },
    render : function() {
        return React.DOM.div({
            key : this.props.question.id
        });
    }
});

var QuestReport = React.createClass({
    displayName: 'QuestReport',
    calculateCurrentStreak : function() {
        var answers = this.props.question.answers || {};
        var tempDate = new Date();
        tempDate.setDate(tempDate.getDate() + 1);
        var streak = 0;
        for (var i = 20; i > 0; i--) {
            tempDate.setDate(tempDate.getDate() - 1);
            var key = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' +  tempDate.getDate();
            if (answers[key]) {
                streak +=1;
            } else {
                break
            }
        }
        return streak;
    },
    render : function() {
        return React.DOM.table({
                key : this.props.question.id,
                className : 'report-table'
            },
            React.DOM.tr({
                    key : 'header',
                    className : 'table-header'
                },
                React.DOM.td(null, this.props.question.title)
            ),
            React.DOM.tr({key : 'body'},
                React.DOM.td({
                        key : 'calendar'
                    },
                    CalendarWidget({
                        question : this.props.question
                    })
                ),
                React.DOM.td({
                        key : 'streak',
                        className : 'data-table'
                    },
                    'Current streak:',
                    React.DOM.br(),
                    React.DOM.span({
                        className : 'streak'
                    }, this.calculateCurrentStreak())
                )
            )
        );
    }
});

module.exports = QuestReport;