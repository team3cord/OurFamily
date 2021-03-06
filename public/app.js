angular.module('pullPix',[
    'ngRoute',
    'angularFileUpload',
    'ngAnimate',
    'ui.bootstrap',
    'angularScreenfull'
]);
angular.module('pullPix')
    .controller('ApplicationCtrl', ["$rootScope", function($rootScope){
        $rootScope.$on('login', function(_, user){
            $rootScope.currentUser = user; //
            console.log('appctrl ' + user.username);
    });
}]);

angular.module('pullPix')
    .controller('ListCtrl',["ListSvc", function(ListSvc){
        var vm = this;
   vm.ListAdd = function () {
      if (vm.listBody) {
          ListSvc.create({
              body: vm.listBody
          })
              .success(function(post){
                  vm.posts.unshift(post);
                  vm.listBody = null;
              });
      }
   }
    ListSvc.fetch()
        .success(function (posts) {
           vm.posts = posts
        });

}]);
angular.module('pullPix')
.controller('LoginCollapseCtrl', ["$scope", "UserSvc", "$rootScope", "$location", function ($scope, UserSvc, $rootScope, $location) {
  $scope.isCollapsed = true;

  $scope.login = function(username, password){
            UserSvc.login(username, password)
                .then(function(user){
                    $rootScope.$emit('login', user);
                    console.log('User ' + user);
                    $location.path('/upload');
              });
  			};
  		}]);
angular.module('pullPix')
     .controller('LoginCtrl', ["$scope", "UserSvc", "$location", function($scope, UserSvc, $location){
        $scope.login = function(username, password){
            UserSvc.login(username, password)
                .then(function(user){
                    $scope.$emit('login', user);
                    console.log('User ' + user);
                    $location.path('/upload');
            	});
        };
    }]);

angular.module('pullPix')
    .controller('MemberListCtrl', ["$scope", "MemberListSvc", function($scope, MemberListSvc){
        MemberListSvc.fetch()
            .success(function(users){
                $scope.members = users;
            });
    }]);
angular.module('pullPix')
.controller('ModalDemoCtrl', ["$scope", "$modal", function ($scope, $modal) {


  $scope.open = function ($event) {
     $event.preventDefault();
     var modalInstance = $modal.open({
        templateUrl: 'partials/signin-up.html',
        controller: 'ModalInstanceCtrl'
    });
  };
}]);




// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

angular.module('pullPix')
.controller('ModalInstanceCtrl', ["$scope", "$rootScope", "UserSvc", "$location", "$modalInstance", function ($scope, $rootScope, UserSvc, $location, $modalInstance) {

  $scope.register = function (username, password){
            UserSvc.register(username, password)
                .then(function(user){
                    console.log('WORK');
                    $rootScope.$emit('login', user);
                    $location.path('/upload');
            });
  };

  $scope.login = function(username, password){
            UserSvc.login(username, password)
                .then(function(user){
                    $rootScope.$emit('login', user);
                    console.log('User ' + user);
                    $location.path('/upload');
              });
  };
  
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}]);


angular
    .module('pullPix')
    .controller('ProfileCtrl',["$scope", "ImgMetaSvc", "$routeParams", function($scope, ImgMetaSvc, $routeParams) {
        $scope.userName = $routeParams.userName;

        ImgMetaSvc.fetch($scope.userName)
            .success(function(imgmetas){
               $scope.imgmetas = imgmetas;
                $scope.loadingIsDone = true;
                console.log('Pro ctrl ' +  imgmetas);
            });

    }]);


angular.module('pullPix')
    .controller('RegisterCtrl', ["$scope", "UserSvc", "$location", function($scope, UserSvc, $location){
        $scope.register = function (username, password){
            UserSvc.register(username, password)
                .then(function(user){
                    $scope.$emit('login', user);
                    $location.path('/upload');
            });
        };
    }]);

angular.module('pullPix')
    .config(["$routeProvider", function ($routeProvider){
        $routeProvider
            .when('/',           {controller: 'ModalDemoCtrl',   templateUrl: '/partials/splash-page.html'})
            .when('/upload',     {controller: 'UploadCtrl', controllerAs: 'vm', templateUrl: '/partials/upload-page.html'})
            .when('/photo',      {controller: 'ImgMetaCtrl', templateUrl: '/partials/photo-page.html'}) 
            .when('/photo-map',  {controller: '',            templateUrl: '/partials/map-page.html'})
            .when('/photo-page', {controller: '',            templateUrl: '/partials/photo-page.html'})
            .when('/members', {controller: 'MemberListCtrl',            templateUrl: '/partials/members.html'})
            .when('/fullscreen', {controller: 'FullscreenCtrl',    templateUrl: '/partials/fullscreen.html'})
            .when('/:userName',  {controller: 'ProfileCtrl',  templateUrl: '/partials/profile-page.html'});
     }]);



angular.module('pullPix')
.controller('SignupCollapseCtrl', ["$scope", "UserSvc", "$rootScope", "$location", function ($scope, UserSvc, $rootScope, $location) {
  $scope.isCollapsed = true;

  $scope.register = function (username, password){
            UserSvc.register(username, password)
                .then(function(user){
                    console.log('WORK');
                    $rootScope.$emit('login', user);
                    $location.path('/upload');
            });
  };
}]);
angular
    .module('pullPix')
    .controller('UploadCtrl', Upload);

  Upload.$inject = ['$upload', 'ImgMetaSvc', '$location'];

 
  function Upload($upload, ImgMetaSvc, $location) {
 
 
    var vm = this;
    vm.fileout = null;
    vm.currentuser = null;
    vm.lat = null;
    vm.lon = null;
    vm.cameraModel = null;
    vm.shutterSpeed = null;
    vm.aperture = null;
    vm.iso = null;
    vm.timeDate = null;
    vm.upload = null;
    vm.geometry = null;
    vm.onFileSelect = onFileSelect;
    vm.imgUpdate = imgUpdate;

    function onFileSelect(files) {
 
      vm.upload = $upload.upload({
        url: '/api/user/upload',  
        method: 'POST',
        // data: {myObj: $scope.myModelObj},
        file: files  //number files uploaded

      }).progress(function(evt) {

      }).success(function(data, status, headers, config) {
        console.log('success fileout 1');
        vm.fileout = "/uploads/" + files[0].name;
        //TEMP DELETE NOT WORKING vm.currentuser = CurrentUser.userid;



        try
          {
          console.log('success fileout 2');
          console.log(data);

          // convert deg to dec here
          var lat = data["Profile-EXIF"]['GPS Latitude'];
          var latDirection = data["Profile-EXIF"]['GPS Latitude Ref'];
          var lon = data["Profile-EXIF"]['GPS Longitude'];
          var lonDirection = data["Profile-EXIF"]['GPS Longitude Ref'];
          var iso = data["Profile-EXIF"]['ISO Speed Ratings'];
          var cameraModel = data["Profile-EXIF"].Model;
          var shutterSpeed = data["Profile-EXIF"]['Shutter Speed Value'];
          var aperture = data["Profile-EXIF"]['Aperture Value'];
          var timeDate = data["Profile-EXIF"]['Date Time'];

          var shutterCalc = function (shutterSpeed){
              var speed=  (Math.pow(2,(shutterSpeed[0]/shutterSpeed[1]) ) ) ;
              // DON'T YET KNOW IF THIS FORMULA IS RIGHT - IT IS SOMETHING LIKE THIS
              speed = truncateDecimals(speed, 1);
              return speed;
          };

          var apertureCalc = function (aperture){
              var aperture= (Math.pow(1.4142, (aperture[0]/aperture[1]) ) );

              aperture = truncateDecimals(aperture, 2);
              // DON'T YET KNOW IF THIS FORMULA IS RIGHT - IT IS SOMETHING LIKE THIS
              return aperture;
          };

          var degreeToDecimal = function (coord, compass){
            if (coord != null && compass != null)  //handles missing EXIF data error
            {
              //transforms standard degree min sec EXIF coord to decimal value, latitude or longitude
              //N and E compass positive, S and W compass negative
              var direction = 1;  // N or E
              var decimalCoord; // return value
              var elements = coord.split(",");//should give 3 element array>>> 45/1,31/1,54636/1000
              var degrees=elements[0].split("/"); //should give 2 element array 45,1
              var finalDegrees = degrees[0]/degrees[1];
              var minutes = elements[1].split("/"); //should give 2 element array 31,1
              var finalMinutes = minutes[0]/minutes[1];
              var seconds = elements[2].split("/");  //should give 2 element array 54636/1000
              var finalSeconds = seconds[0]/seconds[1];
              if ((compass === "S")|| (compass === "W"))
                {direction=-1 };
              decimalCoord = direction * (Math.abs(finalDegrees) + (finalMinutes/60.0) + (finalSeconds / 3600.0) );
            }

            decimalCoord = truncateDecimals(decimalCoord, 7);
            return decimalCoord;
         };
          console.log("generate lat lon");


          vm.lat = degreeToDecimal(lat, latDirection);
          vm.lon = degreeToDecimal(lon, lonDirection);

          vm.cameraModel = cameraModel;
          vm.shutterSpeed = shutterCalc(shutterSpeed);
          vm.aperture = apertureCalc(aperture);
          vm.iso = iso;
          vm.timeDate = timeDate;

          console.log(iso + " is iso");
          console.log(cameraModel + " is cameraModel");
          console.log(aperture + " is aperture");
          console.log(shutterSpeed + " is shutterSpeed");
          console.log(lat + " is lat");
          console.log(lon + " is lon");
      }
      catch(err)
      {
          console.log("EXIF read error was " + err);
          vm.lat = null;
          vm.lon = null;
          vm.cameraModel = null;
          vm.shutterSpeed = null;
          vm.aperture = null;
          vm.iso = null;
          vm.timeDate = null;
      }
      //end try catch

     });
  }

  function imgUpdate(metadata, currentUser, imgpath){
            if(metadata){
                ImgMetaSvc.create({
                  username        : currentUser.username,
                  path            : imgpath,
                  title           : metadata.title,
                  caption         : metadata.caption,
                  tags            : metadata.tags,
                  camera          : metadata.camera,
                  shutter         : metadata.shutter,
                  aperture        : metadata.aperture,
                  iso             : metadata.iso,
                  date            : metadata.date
                })
                .success(function(imgmeta){
                  console.table(imgmeta);
                  //metadata = null;
                  $location.path('/' + currentUser.username);
 
                });
        }
    };
}


function truncateDecimals (num, digits) {
    var numS = num.toString(),
        decPos = numS.indexOf('.'),
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;

    return parseFloat(finalResult);
}

angular
    .module('pullPix')
    .directive('gears', ["$timeout", function($timeout){
        return {
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var myEl = angular.element(document.querySelector('#myfullscreen'));
                    myEl.removeClass('gears');
                }, 6000);
            }
        }
    }]);
angular
    .module('pullPix')
    .directive('slider', ["$timeout", function($timeout){
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                imgmetas: '='
            },
            link: function(scope, elem, attrs){

                scope.currentIndex = 0;
                console.log('slid-dir ' + scope.imgmetas);
                scope.next = function($event){
                    if($event){$event.preventDefault();}
                   scope.currentIndex < scope.imgmetas.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                };

                scope.prev = function($event){
                    $event.preventDefault();
                    scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.imgmetas.length - 1;
                };

                scope.$watch('currentIndex', function(){
                    scope.imgmetas.forEach(function(imgmeta){
                        imgmeta.visible = false;
                    });
                    scope.imgmetas[scope.currentIndex].visible = true;
                });
                scope.fullScreen = function(){

                }

                /* Start: For Automatic slideshow*/

                var timer;

                var sliderFunc=function(){
                    timer=$timeout(function(){
                        scope.next();
                        timer=$timeout(sliderFunc,5000);
                    },5000);
                };

                sliderFunc();

                scope.$on('$destroy',function(){
                    $timeout.cancel(timer);
                });

                /* End : For Automatic slideshow*/
            },
            templateUrl: 'partials/slider.html'
        }
    }]);

angular.module('pullPix')
    .service('ImgMetaSvc', ["$http", function($http){
        this.fetch = function(username){
            return $http.get('/img-meta/' + username);
        };
        this.create = function(imgmeta){
            return $http.post('/img-meta', imgmeta);
        }
    }]);

angular.module('pullPix')
    .service('ListSvc', ["$http", function($http){
       this.fetch = function(){
            return $http.get('http://localhost:3000/api/posts');
       };
        this.create = function(post){
            return $http.post('http://localhost:3000/api/posts', post);
        };
    }]);


angular.module('pullPix')
    .service('MemberListSvc', ["$http", function($http){
        this.fetch = function(){
            return $http.get('/member');
        }
    }]);
angular.module('pullPix')
    .service('UserSvc', ["$http", "$window", function ($http, $window) {
        var svc = this;
        svc.getUser = function () {
            return $http.get('/users',{
                headers: {'X-Auth': this.token}
            })
                .then(function (response) {
                    return response.data;
                });
        };
        svc.login = function (username, password) {
            return $http.post('/sessions', {
                username: username, password: password
            }).then(function (response) {
                console.log("Res data " + response.data);
                $window.localStorage.setItem('access_token', response.data);
                $window.localStorage.setItem('username', username);
                svc.token = response.data;
                $http.defaults.headers.common['X-Auth'] = response.data;
                return svc.getUser();
            });
        };
        svc.register = function (username, password) {
            return $http.post('/users', {
                username: username, password: password
            }).then(function () {
                return svc.login(username, password);
            });
        };
    }]);
