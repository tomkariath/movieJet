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
	'ojs/ojcore', 'knockout', 'jquery',
	'ojs/ojmodel', 'ojs/ojcollectiontabledatasource',
	'ojs/ojknockout',
	'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojinputnumber',
	'ojs/ojinputtext', 'ojs/ojdialog', 'ojs/ojbutton', 'ojs/ojformlayout'],
	function (accUtils, oj, ko, $, Model, CollectionTableDataSource) {
		function DashboardViewModel() {

			var self = this;
			self.newMovieName = ko.observable('');
			self.workingId = ko.observable('');
			//var rootViewModel = ko.dataFor(document.getElementById('mainContent'));
			var cred = getCookie("cred");
			// btoa(rootViewModel.loginUser + ":" + rootViewModel.loginPassword)


			self.upVote = function (id, event) {
				var movieId = self.MovieCol().get(id).get("id");
				$.ajax({
					url: "http://localhost:8080/movies/" + movieId + "/upvote",
					type: 'GET',
					dataType: 'json',
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization",
							"Basic " + cred);
					}
				});
				self.MovieCol(new self.MovieCollection());
				self.datasource(new oj.CollectionTableDataSource(self.MovieCol()));
				document.getElementById("table").refresh();
			};

			self.downVote = function (id, event) {
				var movieId = self.MovieCol().get(id).get("id");
				$.ajax({
					url: "http://localhost:8080/movies/" + movieId + "/downvote",
					type: 'GET',
					dataType: 'json',
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization",
							"Basic " + cred);
					}
				});
				self.MovieCol(new self.MovieCollection());
				self.datasource(new oj.CollectionTableDataSource(self.MovieCol()));
				document.getElementById("table").refresh();
			};

			// Create handler
			self.addMovie = function (event) {
				var newMovie = {};
				newMovie["name"] = self.newMovieName();
				//var recordAttrs = { id: self.newMovieId(), name: self.newMovieName() };
				$.ajax({
					type: "POST",
					contentType: "application/json",
					url: "http://localhost:8080/movies",
					data: JSON.stringify(newMovie),
					dataType: 'text',
					cache: false,
					beforeSend: function (xhr) {
						xhr.setRequestHeader("Authorization",
							"Basic " + cred);
					}
				});
				self.MovieCol(new self.MovieCollection());
				self.datasource(new oj.CollectionTableDataSource(self.MovieCol()));
				document.getElementById("table").refresh();
			};

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

			self.serviceURL = 'http://localhost:8080/movies';
			//self.serviceURL = 'data/movieData.json';
			self.MovieCol = ko.observable();
			self.datasource = ko.observable();

			self.myBasicAuth = function () { };
			self.myBasicAuth.prototype.getHeader = function () {
				var headers = {};
				headers['Authorization'] = 'Basic ' + cred;

				return headers;
			};

			this.connected = () => {
				accUtils.announce('Dashboard page loaded.', 'assertive');
				document.title = "Dashboard";
				// Implement further logic if needed
				var addMovieDiv = document.getElementById('addMovie');
				if (getCookie("admin") === 'true') {
					addMovieDiv.style.display = "block";
				}
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
			self.datasource(new oj.CollectionTableDataSource(self.MovieCol()));

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
