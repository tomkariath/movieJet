define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojinputtext',
      'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojknockout-validation'],
      function (oj, ko, $)
      {

        function LoginContentViewModel()
        {
          var self = this;
          self.user = ko.observable("Super");
          self.password = ko.observable("");
          self.submittedValue = ko.observable("");
          self.tracker = ko.observable();

          var rootViewModel = ko.dataFor(document.getElementById('mainContent'));

          self.submitBt = function (data, event)
          {
            var tracker = self.tracker();
            // ensure that no component in the page is invalid, before submitting the form.
            if (tracker.invalidHidden || tracker.invalidShown)
            {
              tracker.showMessages();
              tracker.focusOnFirstInvalid();
              self.submittedValue("");
              return;
            }
            self.submittedValue(self.user() + " - " + self.password());
            rootViewModel.loginUser = self.user();
            rootViewModel.loginPassword = self.password();
            //change this to a valid ajax call.
            $.ajax({
            url: "http://localhost:8080/movies",
            type: 'GET',
            dataType: 'json',
            beforeSend: function (xhr) {
              xhr.setRequestHeader ("Authorization", "Basic " + btoa(self.user() + ":" + self.password()));
            },
            success: function (data, textStatus, jqXHR) {
                var x = data;
                //alert(rootViewModel.isLoggedIn);
                rootViewModel.userLogin(self.user());
                rootViewModel.isLoggedIn = true;
            },
            error: function(e) {
              alert('jumba');
              rootViewModel.isLoggedIn = false;
              
            }
            });
            return true;
        }
		
        $("input").keypress(function (e) {
          if ((e.which && e.which == $.ui.keyCode.ENTER) || (e.keyCode && e.keyCode == $.ui.keyCode.ENTER)) {
            //validate the element before submitting
            var valid = true;
            if(e.target.type === "password"){
              valid = $("#"+e.target.id).ojInputPassword("validate");
            }
            else if (e.target.type === "text") {
              valid = $("#"+e.target.id).ojInputText("validate");
            }
            if(valid){
              self.submitBt();
              return false;
            }
            self.submittedValue("");
            return true;
          } else {
            return true;
          }
        });
      };
      
      return new LoginContentViewModel();    
    });