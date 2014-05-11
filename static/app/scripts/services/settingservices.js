var settingservices = angular.module('crmEngine.settingservices',[]);
settingservices.factory('Conf', function($location) {
      function getRootUrl() {
        var rootUrl = $location.protocol() + '://' + $location.host();
        if ($location.port())
          rootUrl += ':' + $location.port();
        return rootUrl;
      };
      return {
        'clientId': '987765099891.apps.googleusercontent.com',
        'apiBase': '/api/',
        'rootUrl': getRootUrl(),
        'scopes': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar',
        'requestvisibleactions': 'http://schemas.google.com/AddActivity ' +
                'http://schemas.google.com/ReviewActivity',
         'cookiepolicy': 'single_host_origin',
         // Urls
         'accounts': '/#/accounts/show/',
         'contacts': '#/contacts/show/',
         'leads': '/#/leads/show/',
         'opportunities': '/#/opportunities/show/',
         'cases': '/#/cases/show/',
         'shows': '/#/shows/show/'
      };
});
settingservices.factory('Opportunitystage', function($http) {
	 var Opportunitystage = function(data) {
    angular.extend(this, data);
  }
Opportunitystage.list = function($scope,params){
	$scope.isLoading = true;
	gapi.client.crmengine.opportunitystages.list(params).execute(function(resp){
    console.log('************************************');
    console.log(params);
		if(!resp.code){

      console.log(resp.items);
			$scope.opportunitystages = resp.items;
     $scope.isLoading = false;

			$scope.$apply();

		}
		else{
          if(resp.code==401){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
          };
		};

	})
	};

  Opportunitystage.get = function($scope,id){
    gapi.client.crmengine.opportunitystages.get(params).execute(function(resp){
      if(!resp.code){
               $scope.oppstage = resp;
             }

    })
    };

  Opportunitystage.update= function($scope,params){
     $scope.isLoading = true;
     gapi.client.crmengine.opportunitystages.patch(params).execute(function(resp){
      if (!resp.code){
        $scope.listoppstage();
        $scope.isLoading = false;
        $scope.$apply();

      }
        else{
           alert("Error, response is: " + angular.toJson(resp));

        }

    }

      )

  };



  Opportunitystage.insert = function($scope,params){
    $scope.isLoading = true;
    gapi.client.crmengine.opportunitystages.insert(params).execute(function(resp){
      $scope.listoppstage();
      $scope.isLoading = true;
      $scope.$apply();


    }

  )};
  Opportunitystage.delete = function($scope,params){
      $scope.isLoading = true;
      gapi.client.crmengine.opportunitystages.delete(params).execute(function(resp) {
              if(!resp.code){


                 $scope.listoppstage();
                 // Loaded succefully
                 $scope.isLoading = false;
                 // Call the method $apply to make the update on the scope
                 $scope.$apply();
              }else {
                  $scope.isLoading = false;
                 // Call the method $apply to make the update on the scope
                  $scope.$apply();
              }
      });
  };
return Opportunitystage;
});
//HKA 14.12.2013 Case status Services
settingservices.factory('Casestatus',function($http){
  var Casestatus = function(data){
    angular.extend(this,data);
  };
  //HKA 14.12.2013 Case status Insert
  Casestatus.insert = function($scope,params){
     $scope.isLoading = true;
    gapi.client.crmengine.casestatuses.insert(params).execute(function(resp){
       $scope.casestatuslist();
       $scope.isLoading = false;
       $scope.$apply();

    }
     )};
  //HKA 14.12.2013 Case status list
  Casestatus.list = function($scope,params){

    gapi.client.crmengine.casestatuses.list(params).execute(function(resp){
      if(!resp.code){
        $scope.casesatuses = resp.items;

        $scope.$apply();

      }

        else{
            if(resp.code==401){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
            };
        }

    }
    )};
   Casestatus.update= function($scope,params){
     $scope.isLoading = true;
     gapi.client.crmengine.casestatuses.patch(params).execute(function(resp){
      if (!resp.code){
        $scope.casestatuslist();
        $scope.isLoading = false;
        $scope.$apply();


      }
        else{
           alert("Error, response is: " + angular.toJson(resp));

        }

    })};

  Casestatus.delete = function($scope,id){
     $scope.isLoading = true;
    gapi.client.crmengine.casestatuses.delete(id).execute(function(resp){
       console.log('I am on casestatuses delete services');

       $scope.casestatuslist();
       $scope.isLoading = false;
       $scope.$apply();
    })
  };



   return Casestatus;
  });

//HKA 14.12.2013 Case status Services
settingservices.factory('Leadstatus',function($http){
  var Leadstatus = function(data){
    angular.extend(this,data);
  };
  //HKA 14.12.2013 Case status Insert
  Leadstatus.insert = function($scope,params){
    $scope.isLoading = true;
    gapi.client.crmengine.leadstatuses.insert(params).execute(function(resp){
      if(!resp.code){
        $scope.listleadstatus();
        $scope.isLoading = false;
        $scope.$apply();

      }

        else{
          alert("Error, response is:"+angular.toJson(resp));
        }

    }
     )};
  //HKA 14.12.2013 Case status list
  Leadstatus.list = function($scope,params){

    gapi.client.crmengine.leadstatuses.list(params).execute(function(resp){
      if(!resp.code){
        $scope.leadstatuses = resp.items;
        $scope.isLoading = false;
        $scope.$apply();

      }

        else{
              if(resp.code==401){
                $scope.refreshToken();
                $scope.isLoading = false;
                $scope.$apply();
              };
        }

    }
    )};

    Leadstatus.update = function($scope,params) {
      $scope.isLoading = true;
      gapi.client.crmengine.leadstatuses.patch(params).execute(function(resp){
        if (!resp.code){
          $scope.listleadstatus();
          $scope.isLoading = false;
          $scope.$apply();
        }
          else{
            alert("Error, response is"+angular.toJson(resp));
          }


      }

        )};


  Leadstatus.delete = function($scope,id){
     $scope.isLoading = true;
    gapi.client.crmengine.leadstatuses.delete(id).execute(function(resp){


        $scope.listleadstatus();
       $scope.isLoading = false;
       $scope.$apply();
    })
  };


   return Leadstatus;
  });
