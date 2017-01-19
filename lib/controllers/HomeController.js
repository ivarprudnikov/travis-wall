angular.module('travis-wall')
    .controller('HomeController', function ($scope, $location, TravisRepository) {
        'use strict';

        $scope.user = new User();

        $scope.login = function () {
            TravisRepository
                .get($scope.user)
                .then(function (repositories) {
                    if (repositories.length) {
                        if ($scope.user.token !== '') {
                            $location.search('travisToken', $scope.user.travisToken);
                        }

                        $location.path('/wall');
                    }
                });
        };
    });
