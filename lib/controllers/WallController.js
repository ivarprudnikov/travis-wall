angular.module('travis-wall')
    .controller('WallController', function ($scope, $routeParams, $interval, $location, TravisRepository) {
        'use strict';

        $scope.user = new User(null, null, $routeParams.travisToken);

        var _redirect = function () {
            $location.search('travisToken', null);
            $location.path('/');
        };

        var _wall = function () {
            TravisRepository
                .get($scope.user)
                .then(function (repositories) {
                    if (!repositories.length) {
                        _redirect();
                    }

                    $scope.user.repositories = repositories;
                }, _redirect);
        };

        _wall();

        var _interval = $interval(_wall, 15000);

        $scope.$on('$destroy', function () {
            $interval.cancel(_interval);
        });
    });
