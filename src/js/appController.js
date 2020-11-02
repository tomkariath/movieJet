/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 
'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 
'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 
'ojs/ojarraydataprovider', 'ojs/ojoffcanvas', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, 
    UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, OffcanvasUtils) {
     function ControllerViewModel() {

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      let navData = [
        { path: '', redirect: 'login' },
        { path: 'login', detail: { label: 'Login', iconClass: 'oj-ux-ico-contact-group'} },
        { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart', id: 'dashboard'}}
      ];

      this.isLoggedIn = ko.observable(false);
      this.loginUser = ko.observable(false);
      this.loginPassword = ko.observable(false);
      this.isAdmin = ko.observable(false);

      this.menuItemAction = function (event) {
        var selectedMenuOption = event.path[0].id;
        if (selectedMenuOption === "out"){
         /* alert(this.isLoggedIn+"-"+this.loginUser+"-"+this.loginPassword);
          this.isLoggedIn = false;
          this.loginUser = "";
          this.loginPassword= "";
          alert(this.isLoggedIn+"-"+this.loginUser+"-"+this.loginPassword);*/
          deleteCookie("cred");
          deleteCookie("admin");
          deleteCookie("username");
          location.reload();
        }
      }

      function deleteCookie (cookieName) {
        var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = cookieName + "=;" + expires + ";path=/";
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

      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      this.moduleAdapter = new ModuleRouterAdapter(router);

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});

      // Drawer
      // Close offcanvas on medium and larger screens
      this.mdScreen.subscribe(() => {OffcanvasUtils.close(this.drawerParams);});
      this.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        this.navDrawerOn = true;
        return OffcanvasUtils.toggle(this.drawerParams);
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("Movie App");
      // User Info used in Global Navigation area
      if (getCookie("username")==""){
        this.userLogin = ko.observable("No User Logged In");
      }
      else {
        this.userLogin = ko.observable(getCookie("username"));
      }

      // Footer
      this.footerLinks = [
        {name: 'About Oracle', linkId: 'aboutOracle', linkTarget:'http://www.oracle.com/us/corporate/index.html#menu-about'},
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
     }

     return new ControllerViewModel();
  }
);
