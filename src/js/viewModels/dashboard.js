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
	'ojs/ojmodel', 'ojs/ojcollectiondataprovider',
	'ojs/ojknockout', 
	'ojs/ojtable', 'ojs/ojcheckboxset', 'ojs/ojinputnumber',
	'ojs/ojinputtext', 'ojs/ojdialog', 'ojs/ojbutton'],
	function (accUtils, oj, ko, $, Model, CollectionDataProvider) {
		function DashboardViewModel() {

			var self = this;
			self.somethingChecked = ko.observable(false);
			self.currentDeptName = ko.observable('default');
			self.newMovieId = ko.observable(555);
			self.newMovieName = ko.observable('');
			self.workingId = ko.observable('');

			self.upVote = function (id, event) {
				alert(self.MovieCol().get(id).get("id"));
			};

			self.downVote = function (id, event) {
				alert(self.MovieCol().get(id).get("id"));
			};

			self.updateDeptName = function (formData, event) {
				var currentId = self.workingId();
				var myCollection = self.DeptCol();
				var myModel = myCollection.get(currentId);
				var newName = self.currentDeptName();
				if (newName != myModel.get('DepartmentName') && newName != '') {
					myModel.save({ 'DepartmentName': newName }, {
						success: function (myModel, response, options) {
							document.getElementById("editDialog").close();
						},
						error: function (jqXHR, textStatus, errorThrown) {
							alert("Update failed with: " + textStatus);
							document.getElementById("editDialog").close();
						}
					});
				} else {
					alert('Department Name is not different or the new name is not valid');
					document.getElementById("editDialog").close();
				}
			};

			// Create handler
			self.addMovie = function (event) {
				var recordAttrs = { id: self.newMovieId(), name: self.newMovieName() };
				self.MovieCol().create(recordAttrs, {
					wait: true,
					contentType: 'application/vnd.oracle.adf.resource+json',
					success: function (model, response) {
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log('Error in Create: ' + textStatus);
					}
				});
			};

			var self = this;
			var rootViewModel = ko.dataFor(document.getElementById('mainContent'));

			self.serviceURL = 'http://localhost:8080/movies';
			//self.serviceURL = 'data/movieData.json';
			self.MovieCol = ko.observable();
			self.datasource = ko.observable();

			self.myBasicAuth = function () { };
			self.myBasicAuth.prototype.getHeader = function () {
				var headers = {};
				headers['Authorization'] = 'Basic ' + btoa(rootViewModel.loginUser + ":" + rootViewModel.loginPassword);

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
