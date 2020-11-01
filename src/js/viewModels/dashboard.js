/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore 
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['accUtils',
	'ojs/ojcore', 'knockout',
	'ojs/ojknockout',
	'ojs/ojmodel', 'ojs/ojcollectiondataprovider',
	'ojs/ojtable'],
	function (accUtils, oj, ko, Model, CollectionDataProvider) {
		function DashboardViewModel() {

			var self = this;

			self.serviceURL = 'http://localhost:8080/movies';
			//self.serviceURL = 'data/movieData.json';
			self.MovieCol = ko.observable();
			self.datasource = ko.observable();

			self.myBasicAuth = function () { };
			self.myBasicAuth.prototype.getHeader = function () {
				var headers = {};
				headers['Authorization'] = 'Basic ' + btoa("Johny:Oracle123");

				return headers;
			};

			this.connected = () => {
				accUtils.announce('Dashboard page loaded.', 'assertive');
				document.title = "Dashboard";
				// Implement further logic if needed
			};

			self.parseMovie = function (response) {
				return {
					id: response['id'],
					name: response['name'],
					goodCount: response['goodCount'],
					badCount: response['badCount']
				};
			};

			self.Movie = oj.Model.extend({
				urlRoot: self.serviceURL,
				parse: self.parseMovie,
				idAttribute: 'id'
			});

			self.myMovie = new self.Movie();
			self.MovieCollection = oj.Collection.extend({
				url: self.serviceURL,
				model: self.myMovie,
				oauth: new self.myBasicAuth(),
				comparator: "id"
			});

			self.MovieCol(new self.MovieCollection());
			//DataProvider?
			self.datasource(new oj.CollectionDataProvider(self.MovieCol()));

			/**
			 * Optional ViewModel method invoked after the View is disconnected from the DOM.
			 */
			this.disconnected = () => {
				// Implement if needed
			};

			/**
			 * Optional ViewModel method invoked after transition to the new View is complete.
			 * That includes any possible animation between the old and the new View.
			 */
			this.transitionCompleted = () => {
				// Implement if needed
			};

		}

		/*
		 * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
		 * return a constructor for the ViewModel so that the ViewModel is constructed
		 * each time the view is displayed.
		 */
		return DashboardViewModel;
	}
);
