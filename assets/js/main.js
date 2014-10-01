var React = require('./deps/react');

var AddQuestion = require('./addQuestion');
var QuestionList = require('./questionList');
var DailyQuestSubmit = require('./dailySubmit/dailyQuestSubmit');
var LoginComponent = require('./loginComponent');

var dateFormat = require('./util').dateFormat;

var App = React.createClass({
    getInitialState: function() {
        return {
            questions: [],
            bestOfs : [],
            purposes : []
        };
    },
    resourceName : {
        questions : 'question',
        bestOfs : 'bestOf',
        purposes : 'purpose'
    },
    updateItemInState : function(modelsName, item, oldId) {
        var items = this.state[modelsName];
        for (var i = 0; i < items.length; i++) {
            var itemInState = items[i];
            if (itemInState.id === item.id || itemInState.id === oldId) {
                items[i] = item;
                this.updateState(modelsName, items);
                break;
            }
        }
    },
    addItemToState : function(modelsName, item) {
        var items = this.state[modelsName].concat(item);
        this.updateState(modelsName, items);
    },
    updateState : function(fieled, newValue) {
        var obj = {};
        obj[fieled] = newValue;
        var state = React.addons.update(this.state, {
            $merge : obj
        });
        this.setState(state);
    },
    removeItemFromState : function(modelsName, item) {
        for (var i = 0; i < this.state[modelsName].length; i++) {
            var question = this.state[modelsName][i];
            if (question.id === item.id) {
                var items = React.addons.update(this.state[modelsName], {
                    $splice : [[i, 1]]
                });
                this.updateState(modelsName, items);
                break;
            }
        }
    },
    setupConnection : function(modelsName) {
        var resourceName = this.resourceName[modelsName];

        // get items from server
        io.socket.get('/' + resourceName, function (res) {
            this.updateState(modelsName, res)
        }.bind(this));

        // subscribe to all events
        io.socket.get('/' + resourceName + '/subscribe');

        // on any new event
        io.socket.on(resourceName, function (res) {
            if (res.verb && res.verb === 'created') {
                this.addItemToState(modelsName, res.data)
            } else if (res.verb && res.verb === 'destroyed') {
                this.removeItemFromState(modelsName, res)
            } else if (res.verb && res.verb === 'updated') {
                this.updateItemInState(modelsName, res);
            }
        }.bind(this));
    },
    componentDidMount: function() {
        this.setupConnection('questions');
        this.setupConnection('bestOfs');
        this.setupConnection('purposes');
    },
    addItem : function(modelsName, item) {
        var resource = this.resourceName[modelsName];
        var fakeId = 'fake' + Math.random();
        io.socket.post('/' + resource + '/create', item, function (res) {
            if (res.error) {
                console.error(res.error);
            }
            this.updateItemInState(modelsName, res, fakeId);
        }.bind(this));
        item.id = fakeId;
        this.addItemToState(modelsName, item);
    },
    removeItem : function(modelsName, item) {
        var resource = this.resourceName[modelsName];
        io.socket.get('/' + resource + '/destroy/' + item.id, function (res) {
            if (res.error) {
                console.error(res.error);
            }
        });
        this.removeItemFromState(modelsName, item);
    },
    updateItem : function(modelsName, item) {
        if (!item.id) {
            this.addItem(modelsName, item);
            return;
        }
        if (item.id.toString().slice(0,4) === 'fake') {
            return;
        }
        var resource = this.resourceName[modelsName];
        io.socket.put('/' + resource + '/' + item.id, item, function (res) {
            if (res.error) {
                console.error(res.error);
            }
//            this.updateItemInState(modelsName, res);
        }.bind(this));
        this.updateItemInState(modelsName, item);
    },
    render: function() {
        return React.DOM.div(null,
                React.DOM.div({
                        className : 'grid-25'
                    },
                    DailyQuestSubmit({
                        questions : this.state.questions,
                        bestOfs : this.state.bestOfs,
                        purposes : this.state.purposes,
                        removeQuestion : function(question) {
                            this.removeItem('questions', question);
                        }.bind(this),
                        updateQuestion : function(question) {
                            this.updateItem('questions', question);
                        }.bind(this),
                        updateBestOf : function(bestOf) {
                            this.updateItem('bestOfs', bestOf);
                        }.bind(this),
                        updatePurpose : function(purpose) {
                            this.updateItem('purposes', purpose);
                        }.bind(this)
                    }),
                    AddQuestion({
                        addQuestion : function(question) {
                            this.addItem('questions', question);
                        }.bind(this)
                    })
                ),
                React.DOM.div({
                        className : 'grid-75'
                    },
                    QuestionList({
                        questions : this.state.questions
                    })
                )
            );
    }
});


if (window.user.logged) {
    React.renderComponent(
        App(),
        document.getElementById('content')
    );
} else {
    // hide logout button
    document.getElementById('logoutButton').style.display ='';

    React.renderComponent(
        LoginComponent(),
        document.getElementById('loginContainer')
    );
}

