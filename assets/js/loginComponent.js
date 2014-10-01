var React = require('./deps/react');

var LoginComponent = React.createClass({
    displayName: 'LoginComponent',
    render : function() {
        return React.DOM.div({
                style : {
                    'text-align' : 'center'
                }
            },
            'Login with:',
            React.DOM.br(),
            React.DOM.div({
                    style : {
                        display : 'inline-flex'
                    }
                },
                React.DOM.a({
                        href : '/auth/google',
                        className : 'login-button'
                    },
                    React.DOM.span({
                        className : 'fa fa-google-plus-square fa-5x',
                        style : { color : 'grey'}
                    })
                ),

                React.DOM.a({
                        href : '/auth/demoLogin',
                        className : 'login-button'
                    },
                    React.DOM.div(null,
                        React.DOM.span({
                                className : 'fa fa-question-circle',
                                style : {
                                    color : 'grey',
                                    'font-size' : '3.5em'
                                }
                            }
                        ),
                        React.DOM.br(),
                        React.DOM.span({
                                style : { color : 'grey'}
                            },
                            'Demo login'
                        )
                    )
                )
            )
        )
    }
});

module.exports = LoginComponent;