define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojinputtext',
  'ojs/ojvalidation-number', 'ojs/ojbutton', 'ojs/ojknockout-validation'],
  function (oj, ko, $) {

    function LoginContentViewModel() {
      var self = this;
      self.user = ko.observable("Super");
      self.password = ko.observable("");
      self.submittedValue = ko.observable("");
      self.tracker = ko.observable();

      var rootViewModel = ko.dataFor(document.getElementById('mainContent'));

      self.submitBt = function (data, event) {
        var tracker = self.tracker();
        // ensure that no component in the page is invalid, before submitting the form.
        if (tracker.invalidHidden || tracker.invalidShown) {
          tracker.showMessages();
          tracker.focusOnFirstInvalid();
          self.submittedValue("");
          return;
        }
        self.submittedValue(self.user() + " - " + self.password());
        //rootViewModel.loginUser = self.user();
        //rootViewModel.loginPassword = self.password();
        self.setCookie("cred", btoa(self.user() + ":" + self.password()), 1);
        
        $.ajax({
          url: "http://localhost:8080/users/" + self.user() + "/roles",
          type: 'GET',
          dataType: 'json',
          beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(self.user() + ":" + self.password()));
          },
          success: function (data, textStatus, jqXHR) {
            var role = JSON.stringify(data);
            //alert(self.getCookie("cred"));
            self.setCookie("username", self.user(), 1);
            rootViewModel.userLogin(getCookie("username"));
           // rootViewModel.isLoggedIn = true;

            if (role.includes("ADMIN")) {
              //rootViewModel.isAdmin = true;
              self.setCookie("admin", true, 1);
            }
            else {
              //rootViewModel.isAdmin = false;
              self.setCookie("admin", false, 1);
            }
          },
          error: function (e) {
            alert('invalid username/password');
            //rootViewModel.isLoggedIn = false;

          }
        });
        return true;
      }

      self.setCookie = function (cookieName, cookieValue, expiry) {
        var d = new Date();
        d.setTime(d.getTime() + (expiry * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
      }

      function getCookie (cookieName) {
				var name = cookieName + "=";
				var decodedCookie = decodeURIComponent(document.cookie);
				var ca = decodedCookie.split(';');
				for (var i = 0; i < ca.length; i++) {
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						return c.substring(name.length, c.length);
					}
				}
				return "";
			};

      $("input").keypress(function (e) {
        if ((e.which && e.which == $.ui.keyCode.ENTER) || (e.keyCode && e.keyCode == $.ui.keyCode.ENTER)) {
          //validate the element before submitting
          var valid = true;
          if (e.target.type === "password") {
            valid = $("#" + e.target.id).ojInputPassword("validate");
          }
          else if (e.target.type === "text") {
            valid = $("#" + e.target.id).ojInputText("validate");
          }
          if (valid) {
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