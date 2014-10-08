var React = require('../deps/react');
var dateFormat = require('../util').dateFormat;

var BestOfComponent = React.createClass({
    displayName: 'BestOfComponent',
    colors : ['lightcoral', 'yellow', '#CFFF21', '#21FF29'],
    days : ['miserable', 'usual', 'very good', 'awesome'],
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
    findBestOf : function(key) {
        var currentBestOf = undefined;
        this.props.bestOfs.forEach(function(bestOfItem) {
            if (bestOfItem.key === key && bestOfItem.type === 'day') {
                currentBestOf = bestOfItem;
            }
        });
        return currentBestOf;
    },
    weeklyChoose : function() {
        var lastMonthDay = new Date(this.props.date.getFullYear(), this.props.date.getMonth() + 1, 0);
        var chooses = [];
        var date = new Date(this.props.date);
        if (this.props.date.getDay() === 0 || this.props.date.toDateString() === lastMonthDay.toDateString()) {
            var bestOfItem = this.findBestOf(dateFormat(this.props.date, 'yyyy-mm-dd'));
            if (bestOfItem) {
                chooses.unshift(bestOfItem);
            }
            while (true) {
                date.setDate(date.getDate() - 1);
                if (date.getDay() !== 0 && this.props.date.getMonth() === date.getMonth()) {
                    bestOfItem = this.findBestOf(dateFormat(date, 'yyyy-mm-dd'));
                    if (bestOfItem) {
                        chooses.unshift(bestOfItem);
                    }
                } else {
                    break;
                }
            }
        }
        return chooses;
    },
    submitWeekly: function(weekBestOf, bestOfItem, chooses) {
        var score = this.findScore(chooses);

        var bestOfWeek = {
            key : chooses[0].key,
            value : bestOfItem.key,
            score : score,
            type : 'week'
        };
        if (weekBestOf) {
            bestOfWeek.id = weekBestOf.id;
        }
        this.props.updateBestOf(bestOfWeek);
    },
    findWeekChoose : function(chooses) {
        for(var i = 0; i < chooses.length; i++) {
            var bestOf = chooses[i];
            if (bestOf.type !== 'day') {
                continue;
            }
            for(var j = 0; j < this.props.bestOfs.length; j++) {
                var weekBestOf = this.props.bestOfs[j].type === 'week' ? this.props.bestOfs[j] : null;
                if (weekBestOf && weekBestOf.value === bestOf.key) {
                    return weekBestOf;
                }
            }
        }
    },
    findScore : function(chooses) {
        if (!chooses.length) {
            return 0;
        }
        var sum = 0;
        for(var i in chooses) {
            sum += parseInt(chooses[i].score || 1);
        }
        return Math.round(sum / chooses.length);
    },
    render : function() {
        var createLI = function(bestOfItem) {
            return React.DOM.div({
                    key : bestOfItem.id
                },
                React.DOM.label({
                        className : 'topcoat-radio-button'
                    },
                    React.DOM.input({
                        checked : !!weekBestOf && (bestOfItem.key === weekBestOf.value),
                        type : 'radio',
                        name : 'topcoat',
                        onChange: function() {
                            this.submitWeekly(weekBestOf, bestOfItem, chooses);
                        }.bind(this)
                    }),
                    React.DOM.div({
                        className : 'topcoat-radio-button__checkmark'
                    }),
                    ' ' + bestOfItem.value
                )
            )
        };
        var chooses = this.weeklyChoose();
        var score = this.findScore(chooses);

        var weekBestOf = this.findWeekChoose(chooses);

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
                onInput : this.handleChange,
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
            }, this.days[this.props.bestOfItem.score]),
            chooses.length ? React.DOM.div({
                    style : {
                        'font-align' : 'left'
                    }
                },
                React.DOM.span({
                    style : {
                        color : this.colors[score]
                    }
                }, this.days[score] + ' week'),
                chooses.map(createLI.bind(this))
            ) : null
        );
    }
});

module.exports = BestOfComponent;