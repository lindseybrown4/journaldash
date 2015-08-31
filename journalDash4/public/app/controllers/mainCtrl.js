angular.module('mainCtrl', [])

.controller('MainController', function($rootScope, $location, Auth, $scope) {

	var vm = this; 

	vm.loggedIn = Auth.isLoggedIn();

	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn(); 
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});
	});

	vm.doLogin = function() {

		vm.processing = true; 

		vm.error = ''; 

	Auth.login(vm.loginData.username, vm.loginData.password)
		.success(function(data) {
			vm.procession = false;

				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
					});

					if(data.success)
						$location.path('/');
					else
						vm.error = data.message;
		});
	}

	vm.doLogout = function() {
		Auth.logout(); 
		$location.path('/logout');
	}

	 vm.items = [
	    'The first choice!',
	    'And another choice for you.',
	    'but wait! A third!'
	  ];

	 vm.status = {
	    isopen: false
	  };

vm.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };


});












