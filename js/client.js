// e.g. default config: {
//     service_name: '',
//     async: false,
// }
function NewRPCClient(config) {
    if (config === undefined) {
        config = {};
    }
    var async = (config.async === undefined) ? false : config.async;
    return {
        // A default prefix for rpc method names
        service_name: config.service_name || '',
        // Whether the requests are async or not
        async: async,
        // Player data cached here after signup or login
        player: null,
        history: [],

        // Returns the last element in the history
        last: function() {
            return this.history[this.history.length - 1];
        },

        signup: function(username, password, email) {
            var that = this;
            $.ajax({
                type: 'POST',
                url: '/auth/signup',
                data: {
                    username: username,
                    password: password,
                    email: email,
                },
                async: this.async,
                success: function(data) {
                    that.player = data;
                    that._add_to_history({
                        method: 'signup',
                        args: null,
                        result: data,
                        error: data.errors,
                    });
                },
                error: function(error) {
                    that._add_to_history({
                        method: 'signup',
                        args: null,
                        result: null,
                        error: error,
                    });
                },
            });
        },

        login: function(username, password) {
            var that = this;
            $.ajax({
                type: 'POST',
                url: '/auth/login',
                data: {
                    username: username,
                    password: password,
                },
                async: this.async,
                success: function(data) {
                    that.player = data;
                    that._add_to_history({
                        method: 'login',
                        args: null,
                        result: data,
                        error: data.errors,
                    });
                },
                error: function(error) {
                    that._add_to_history({
                        method: 'login',
                        args: null,
                        result: null,
                        error: error,
                    });
                },
            });
        },

        logout: function() {
            var that = this;
            $.ajax({
                type: 'POST',
                url: '/auth/logout',
                data: {},
                async: this.async,
                success: function(data) {
                    that.player = null;
                    that._add_to_history({
                        method: 'logout',
                        args: null,
                        result: data,
                        error: data.errors,
                    });
                },
                error: function(error) {
                    that._add_to_history({
                        method: 'logout',
                        args: null,
                        result: null,
                        error: error,
                    });
                },
            });
        },

        _rpc: new $.JsonRpcClient({
            ajaxUrl: '/api',
            async: async,
        }),

        // Makes rpc request to method (e.g. 'info.battle').  Add arguments
        // as necessary for that rpc method.
        rpc: function(method) {
            var fullmethod = method;
            if (this.service_name != '') {
                fullmethod = this.service_name + '.' + method;
            }
            var args = Array.prototype.slice.call(arguments, 1);
            var that = this;
            this._rpc.call(fullmethod, args,
                function(result) {
                    that._add_to_history({
                        method: method,
                        args: args,
                        result: result,
                        error: null,
                    });
                }, function(error) {
                    that._add_to_history({
                        method: method,
                        args: args,
                        result: null,
                        error: error,
                    });
                });
        },

        _add_to_history: function(thing) {
            this.history.push(thing);
        }
    };
}

function run_demo() {
    var config = {
        async: false,
    }
    var client = NewRPCClient(config);

    client.login('testuser', 'testpass');
    var login = client.last();
    if (login.error) {
        client.signup('testuser', 'testpass', 'test@example.com');
        var signup = client.last();
        console.log(signup);
        if (signup.error) {
            return
        }
    }
    client.rpc('vestibule.create');
    var vest = client.last();
    console.log(vest);
    if (vest.error !== null) {
        return
    }
    console.log("Starting vestibule (creates world, is slow)");
    client.rpc('vestibule.start', vest.result.vestibule.uid);
    var world = client.last();
    console.log(world);
    return world;
}

$(document).ready(function() {
    var world = run_demo();
    console.log("World created:");
    console.log(world);
});
