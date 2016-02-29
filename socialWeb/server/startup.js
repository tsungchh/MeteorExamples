
Meteor.startup(function () {
// code to run on server at startup
if (!Websites.findOne()){
	console.log("No websites yet. Creating starter data.");
	  Websites.insert({
		title:"Goldsmiths Computing Department", 
		url:"http://www.gold.ac.uk/computing/", 
		description:"This is where this course was developed.", 
		createdOn:new Date(),
		upvote:0,
		downvote:0
	});
	 Websites.insert({
		title:"University of London", 
		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
		description:"University of London International Programme.", 
		createdOn:new Date(),
		upvote:0,
		downvote:0
	});
	 Websites.insert({
		title:"Coursera", 
		url:"http://www.coursera.org", 
		description:"Universal access to the world’s best education.", 
		createdOn:new Date(),
		upvote:0,
		downvote:0
	});
	Websites.insert({
		title:"Google", 
		url:"http://www.google.com", 
		description:"Popular search engine.", 
		createdOn:new Date(),
		upvote:0,
		downvote:0
	});
}
});

// methods that provide write access to the data
Meteor.methods({
  // allows changes to the editing users collection 
  sendRequest:function(url, webId){
  	  // console.log(url);
  	  // console.log(webId);

  	  // console.log(this.user()._id);
	  console.log(this.userId);
  	  console.log(Meteor.userId);
  	  console.log(Meteor.user()._id);


  	  
	  var response = HTTP.call( 'GET', url);
	  // Websites.update( {_id:webId}, {$set: {response:response}});
	  // console.log(response.content);
	  var ret = { _id:webId, response:response};
	  // console.log(response.data);

	  return ret;
  }
})