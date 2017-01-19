function User (token, repositories, travisToken) {
    'use strict';

    if (token === undefined) {
        token = '';
    }

    if (travisToken === undefined) {
        travisToken = '';
    }

    var _token = token;
    var _repositories = new Repositories(repositories);
    var _travisToken = travisToken;

    return {
        get token () {
            return _token;
        },
        set token (token) {
            _token = token;
        },
        get travisToken () {
            return _travisToken;
        },
        set travisToken (travisToken) {
            _travisToken = travisToken;
        },
        get repositories () {
            return _repositories.all;
        },
        set repositories (repositories) {
            _repositories.all = repositories;
        }
    };
}
