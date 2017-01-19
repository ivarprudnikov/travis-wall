angular.module('travis-wall')
    .factory('TravisApi', function ($http,$q) {
        'use strict';

        var TRAVIS_ORG_HOST = 'api.travis-ci.org';
        var TRAVIS_COM_HOST = 'api.travis-ci.com';
        var TRAVIS_ORG_URL = 'https://' + TRAVIS_ORG_HOST;
        var TRAVIS_COM_URL = 'https://' + TRAVIS_COM_HOST;
        var TRAVIS_AUTH_GITHUB_URL = 'https://api.travis-ci.com/auth/github';

        function exchangeGithubToken(user) {
            return $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    'github_token': user.token
                },
                url: TRAVIS_AUTH_GITHUB_URL
            }).then(function (response) {
                return response.data.access_token
            });
        }

        function _createHttp (user, type, useToken) {

            var tokenPromise;
            if (useToken && !user.travisToken) {
                tokenPromise = exchangeGithubToken(user);
            } else {
                tokenPromise = $q(function (resolve) {resolve(user.travisToken);});
            }

            return tokenPromise.then(function (t) {
                var headers = {
                    'Accept': 'application/vnd.travis-ci.2+json'
                };
                if(t){
                    user.travisToken = t;
                    headers.Authorization = ['token',t].join(' ');
                }

                return $http({
                    method: 'GET',
                    headers: headers,
                    url: (useToken ? TRAVIS_COM_URL : TRAVIS_ORG_URL) + '/repos'
                }).then(function (resp) {
                    return resp.data.repos;
                });
            });


        }

        function _createHttpByOwner (user, useToken) {
            return _createHttp(user, 'owner_name', useToken);
        }

        function _createHttpByMember (user, useToken) {
            return _createHttp(user, 'member', useToken);
        }

        return {
            getByOwnerForOrg: function (user) {
                return _createHttpByOwner(user, false);
            },
            getByMemberForOrg: function (user) {
                return _createHttpByMember(user, false);
            },
            getByOwnerForCom: function (user) {
                return _createHttpByOwner(user, true);
            },
            getByMemberForCom: function (user) {
                return _createHttpByMember(user, true);
            }
        };
    });
