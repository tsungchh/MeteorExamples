
/////
// routing
/////
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
  this.render('navbar', {
    to:"navbar"
  });
  this.render('main', {
    to:"main"
  });
});

Router.route('/website/:_id', function() {
	this.render('navbar', {
		to:"navbar"
	});
	this.render('website_detail', {
		to:"main",
		data:function() {
			return Websites.findOne({_id:this.params._id});
		}
	});
});

/////
// template helpers 
/////

// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find( {}, {sort:{upvote:-1}} );
	}
});

Template.website_detail.helpers({
	comments:function(websiteId){
		return Comments.find({websiteId:websiteId});
	},
});


/////
// template events 
/////

Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		console.log("Up voting website with id "+website_id);
		// put the code in here to add a vote to a website!
		// var rating = this.rating;
		
		var uprating = this.upvote+1;

		console.log("up voting, rating = " + uprating);
		Websites.update(
			{_id : website_id}, 
			{ $set: {upvote : uprating}}
		);
		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		var website_id = this._id;
		console.log("Down voting website with id "+website_id);

		// put the code in here to remove a vote from a website!
		var downrating = this.downvote+1;

		console.log("up voting, rating = " + downrating);
		Websites.update(
			{_id : website_id}, 
			{ $set: {downvote : downrating}}
		);
		return false;// prevent the button from reloading the page
	}
})

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}, 
	"submit .js-save-website-form":function(event){

		// here is an example of how to get the url out of the form:
		var title = event.target.title.value;
		var _url = event.target.url.value;
		var _desc = event.target.description.value;
		
		//  put your website saving code in here!
		var site = Websites.insert({
			title:title,
			url : _url,
			description : _desc,
			upvote:0,
			downvote:0,
		});	

		// console.log(site);

		Meteor.call('sendRequest', _url, site, function(error, result){
			if(error)
			{
				console.log("error");
			}else
			{
				//test
				// var titleStart = result.response.toLowerCase().indexOf('<title>');
    //     		var titleEnd  = result.response.toLowerCase().indexOf('</title>')
    //     		var titleText = result.response.substring(titleStart + '<title>'.length, titleEnd);

				var parser = new DOMParser();
  				var doc = parser.parseFromString(result.response, "text/xml");
  				if(doc.getElementsByTagName("description"))
	  				var _desc = doc.getElementsByName("description")[0].content;
				// var title = doc.getElementsByName("og:site_name")[0].content;
				console.log(result);
				// Websites.update( {_id:result._id}, {$set : {description:_desc}});
			}
		});	
		

		return false;// stop the form submit from reloading the page

	}
});


Template.website_detail.events({
	"submit .js-add-comment-form":function(event){
		// console.log("test");
		if(Meteor.user())
		{
			var _id = Meteor.user()._id;
			var email = Meteor.user().emails[0].address;
			var comment = event.target.comment.value;
			console.log("website id = " + this._id);
			Comments.insert({
				websiteId : this._id,
				userId : _id,
				comment : comment,
				email : email
			})
		}

		return false;
	}
});


