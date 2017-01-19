angular.module('travis-wall')
    .factory('TravisRepository', function ($q, TravisApi) {
        'use strict';

        function _getForOrg (user) {
            return _getByMemberForOrg(user).then(function (repositories) {
                if (repositories.length) {
                    return repositories;
                }

                return _getByOwnerForOrg(user);
            });
        }

        function _getForCom (user) {
            return _getByMemberForCom(user).then(function (repositories) {
                if (repositories.length) {
                    return repositories;
                }

                return _getByOwnerForCom(user);
            });
        }

        function _getByMemberForOrg (user) {
            var _deferred = $q.defer();

            TravisApi
                .getByMemberForOrg(user)
                .then(function (repositories) {
                    _deferred.resolve(_setPrivate(repositories, false));
                })
                .catch(function (error) {
                    _deferred.reject(error);
                });

            return _deferred.promise;
        }

        function _getByOwnerForOrg (user) {
            var _deferred = $q.defer();

            TravisApi
                .getByOwnerForOrg(user)
                .then(function (repositories) {
                    _deferred.resolve(_setPrivate(repositories, false));
                })
                .catch(function (error) {
                    _deferred.reject(error);
                });

            return _deferred.promise;
        }

        function _getByMemberForCom (user) {
            var _deferred = $q.defer();

            TravisApi
                .getByMemberForCom(user)
                .then(function (repositories) {
                    _deferred.resolve(_setPrivate(repositories, true));
                })
                .catch(function (error) {
                    _deferred.reject(error);
                });

            return _deferred.promise;
        }

        function _getByOwnerForCom (user) {
            var _deferred = $q.defer();

            TravisApi
                .getByOwnerForCom(user)
                .then(function (repositories) {
                    _deferred.resolve(_setPrivate(repositories, true));
                })
                .catch(function (error) {
                    _deferred.reject(error);
                });

            return _deferred.promise;
        }

        function _setPrivate (repositories, value) {
            for (var key in repositories) {
                repositories[key].private = value;
            }

            return repositories;
        }

        return {
            get: function (user) {
                return _getForCom(user).then(function (comRepositories) {
                    return comRepositories;
                });
            }
        };
    });
