app.controller('FeedBacksListCtrl', ['$scope','$filter','Auth','Feedback',
    function($scope,$filter,Auth,Feedback) {
     $("#id_Feedbacks").addClass("active");
     $scope.isSignedIn = false;
     $scope.immediateFailed = false;
     $scope.nextPageToken = undefined;
     $scope.prevPageToken = undefined;
     $scope.isLoading = false;
     $scope.pagination = {};
     $scope.currentPage = 01;
     $scope.pages = [];
     $scope.feedback = {};
    
         

     // What to do after authentication
     $scope.runTheProcess = function(){
          var params = {'limit':7};
          Feedback.list($scope,params);
     };
     // We need to call this to refresh token when user credentials are invalid
     $scope.refreshToken = function() {
            Auth.refreshToken();
     };
     $scope.listNextPageItems = function(){
        
        
        var nextPage = $scope.currentPage + 1;
        var params = {};
          if ($scope.pages[nextPage]){
            params = {'limit':7,
                      'pageToken':$scope.pages[nextPage]
                     }
          }else{
            params = {'limit':7}
          }
          console.log('in listNextPageItems');
          $scope.currentPage = $scope.currentPage + 1 ; 
          Feedback.list($scope,params);
     }
     $scope.listPrevPageItems = function(){
       
       var prevPage = $scope.currentPage - 1;
       var params = {};
          if ($scope.pages[prevPage]){
            params = {'limit':7,
                      'pageToken':$scope.pages[prevPage]
                     }
          }else{
            params = {'limit':7}
          }
          $scope.currentPage = $scope.currentPage - 1 ;
          Feedback.list($scope,params);
     }
      
     

     $scope.showFeedbackModal = function(){
        console.log('button clicked');
       $scope.feedback.type_feedback = 1;
       $scope.feedback.source = 4;
       $scope.feedback.status = 8;
        $('#addFeedModal').modal('show');

      };
      /*$scope.addFeedbackOnKey = function(feedback){
        if(event.keyCode == 13 && feedback){
            $scope.savefeedback(feedback);
        };
     };*/
     // inserting the feedback  
     $scope.savefeedback = function(feedback){
         
            var params ={'name':feedback.name,
                         'content':feedback.content,
                         'type_feedback':feedback.type_feedback,
                         'source':feedback.source,
                         'status':feedback.status}
             Feedback.insert($scope,params);
             $('#addFeedModal').modal('hide');
            };
    

      

     
     
   // Google+ Authentication 
    Auth.init($scope);

    
}]);

app.controller('FeedBacksShowCtrl', ['$scope','$filter', '$route','Auth','Show', 'Topic','Note','Task','Event','WhoHasAccess','User','Feedback',
    function($scope,$filter,$route,Auth,Show,Topic,Note,Task,Event,WhoHasAccess,User,Feedback) {
      
      $("#id_Feedbacks").addClass("active");
      var tab = $route.current.params.accountTab;
      switch (tab)
        {
        case 'notes':
         $scope.selectedTab = 1;
          break;
        case 'about':
         $scope.selectedTab = 2;
          break;
        case 'contacts':
         $scope.selectedTab = 3;
          break;
        case 'opportunities':
         $scope.selectedTab = 4;
          break;
        case 'cases':
         $scope.selectedTab = 5;
          break;
        default:
        $scope.selectedTab = 1;

        }

     
     $scope.isSignedIn = false;
     $scope.immediateFailed = false;
     $scope.nextPageToken = undefined;
     $scope.prevPageToken = undefined;
     $scope.isLoading = false;
     $scope.pagination = {};
     $scope.currentPage = 01;
     $scope.pages = [];
   
     
     $scope.accounts = [];
     
     
     // What to do after authentication
     $scope.runTheProcess = function(){
          var params = {'id':$route.current.params.feedbackId};
          Feedback.get($scope,params);
     };
     // We need to call this to refresh token when user credentials are invalid
     $scope.refreshToken = function() {
            Auth.refreshToken();
     };

     $scope.createYoutubePicker = function() {
          console.log('ok should create youtube picker');
          var picker = new google.picker.PickerBuilder().
          addView(google.picker.ViewId.YOUTUBE).
         
          build();
          picker.setVisible(true);
      };
     
     $scope.addTask = function(task){
      
        $('#myModal').modal('hide');
        var params ={}

        console.log('adding a new task');
        console.log(task);
        
        if (task.due){

            var dueDate= $filter('date')(task.due,['yyyy-MM-dd']);
            dueDate = dueDate +'T00:00:00.000000'
            params ={'title': task.title,
                      'due': dueDate
            }
            console.log(dueDate);
        }else{
            params ={'title': task.title}
        };
        Task.insert($scope,params);
     }

     $scope.hilightTask = function(){
        console.log('Should higll');
        $('#task_0').effect("highlight","slow");
        $('#task_0').effect( "bounce", "slow" );
       
     }
     $scope.listTasks = function(){
        var params = {/*'about_kind':'Account',
                      'about_item':$scope.account.id,*/
                      'order': '-updated_at',
                      'limit': 5
                      };
        Task.list($scope,params);

     }
     $scope.addEvent = function(ioevent){
      
        $('#newEventModal').modal('hide');
        var params ={}

        console.log('adding a new event');
        
        
        if (ioevent.starts_at){
            if (ioevent.ends_at){
              params ={'title': ioevent.title,
                      'starts_at': $filter('date')(ioevent.starts_at,['yyyy-MM-ddTHH:mm:00.000000']),
                      'ends_at': $filter('date')(ioevent.ends_at,['yyyy-MM-ddTHH:mm:00.000000']),
                      'where': ioevent.where
              }

            }else{
              params ={'title': task.title,
                      'starts_at': $filter('date')(ioevent.starts_at,['yyyy-MM-ddTHH:mm:00.000000']),
                      'where': ioevent.where
              }
            }
            console.log('inserting the event');
            console.log(params);
            Event.insert($scope,params);

            
        };
     }
     $scope.hilightEvent = function(){
        console.log('Should higll');
        $('#event_0').effect("highlight","slow");
        $('#event_0').effect( "bounce", "slow" );
       
     }
     $scope.listEvents = function(){
        var params = {/*'about_kind':'Account',
                      'about_item':$scope.account.id,*/
                      'order': 'starts_at',
                      'limit': 5
                      };
        Event.list($scope,params);

     }

     
     $scope.listNextPageItems = function(){
        
        
        var nextPage = $scope.currentPage + 1;
        var params = {};
          if ($scope.pages[nextPage]){
            params = {'about_kind':'Account',
                      'about_item':$scope.account.id,
                      'order': '-updated_at',
                      'limit': 5,
                      'pageToken':$scope.pages[nextPage]
                     }
          }else{
            params = {'about_kind':'Account',
                      'about_item':$scope.account.id,
                      'order': '-updated_at',
                      'limit': 5}
          }
          console.log('in listNextPageItems');
          $scope.currentPage = $scope.currentPage + 1 ; 
          Topic.list($scope,params);
     }
     $scope.listPrevPageItems = function(){
       
       var prevPage = $scope.currentPage - 1;
       var params = {};
          if ($scope.pages[prevPage]){
            params = {'about_kind':'Account',
                      'about_item':$scope.account.id,
                      'order': '-updated_at',
                      'limit': 5,
                      'pageToken':$scope.pages[prevPage]
                     }
          }else{
            params = {'about_kind':'Account',
                      'about_item':$scope.account.id,
                      'order': '-updated_at',
                      'limit': 5}
          }
          $scope.currentPage = $scope.currentPage - 1 ;
          Topic.list($scope,params);
          console.log()
     }
     
     $scope.listTopics = function(account){
        var params = {'about_kind':'Account',
                      'about_item':account.id,
                      'order': '-updated_at',
                      'limit': 5
                      };
        Topic.list($scope,params);

     }
     $scope.hilightTopic = function(){
        console.log('Should higll');
       $('#topic_0').effect( "bounce", "slow" );
       $('#topic_0 .message').effect("highlight","slow");
     }

    
     $scope.showModal = function(){
        console.log('button clicked');
        $('#addAccountModal').modal('show');

      };
      
    $scope.addNote = function(note){
      console.log('debug addNote');
      
      var params ={
                  'about_kind': 'Account',
                  'about_item': $scope.account.id,
                  'title': note.title,
                  'content': note.content
      };
      console.log(params);
      Note.insert($scope,params);
      $scope.note.title = '';
      $scope.note.content = '';
    };
      



    $scope.editaccount = function() {
       $('#EditAccountModal').modal('show');
    }

      
// Google+ Authentication 
    Auth.init($scope);


}]);