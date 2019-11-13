const router = require('express').Router();
const Vote = require('../models/vote');
const Election = require('../models/election');
const Analytics = require('../models/analytics');


/*
Asynchronous method to iterate through objects of an Array
*/
async function asyncForEach(array, callback){
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/*
Get analytics for a particular election
tags:
  count:          Returns total votes received
  countByCandidate:    Returns the total number of votes for each candidate
  gender:   Returns the votes by gender for each candidate
  avgAge:   Returns the average age of the voters for each candidate
  ageGroup: Returns the number of voters for each age group (18-24, 25-44, 45-64, 65+)
  province: Returns the number of voters of the top 5 most voted from provinces or territory
  cities:   Returns the number of votes from each city
*/
router.get('/:electionID/:tag', async function(req,res){
  console.log("Request recevied for analytic");

  var updateFlag = false;
  var newAnalytic;

  // Find election in question
  try{
    var election = await Election.findById(req.params.electionID).exec();
    if(!election){
      console.log("Election ID not found");
      res.status(404).send();
      return;
    }
  } catch(err){
    console.log(err);
    res.status(500).send();
    return;
  }

  // Check if election is closed ie: all votes submitted
  if(req.tag == "countByCandidate" || req.tag == "gender" || req.tag == "avgAge"){
    if(election.endDate.getTime() > Date.now()){
      console.log("Cannot provide this analytic until end of voting:", election.endDate);
      res.status(400).send();
      return;
    }
  }


  // Check if analytics object already exists for this election
  try{
    let analytic = await Analytics.findOne({electionID: req.params.electionID, tag: req.params.tag}).exec();
    if(analytic){
      updateFlag = true;
      console.log("Existing analytic found, updating...");
      var id = analytic.id;
    }
  } catch(err){
    console.log(err);
    res.status(500).send();
    return;
  }

  if(!updateFlag){
    console.log("Creating new analytic object");
    newAnalytic = new Analytics();
    newAnalytic.electionID = req.params.electionID;
    newAnalytic.tag = req.params.tag;
  }

  var data = [];
  var labels = [];
  var description;

  switch(req.params.tag){
    case "count":
      description = "Total number of votes received";
      try{
        let votes = await Vote.find({electionID: req.params.electionID, authenticated: true}).exec();
        data.push(votes.length);
        labels.push("Total Votes Received");
      } catch(err){
        console.log(err);
        res.status(500).send();
        return;
      }
      break;

    case "countByCandidate":
      description = "Total number of votes received by each candidate";
      // For all candidates
      await asyncForEach(election.candidates,async function(candidate){
        // Get all votes for each candidate
        var name = candidate.firstName + ' ' + candidate.lastName;
        name = name.toLowerCase()
        try{
          let votes = await Vote.find({electionID: req.params.electionID, candidate: name, authenticated: true}).exec();
          console.log("Total number of votes found: %d", votes.length);
          data.push(votes.length);
          labels.push(name);
        } catch(err){
          console.log(err);
          res.status(500).send();
          return;
        }
      });
      break;

    case "gender":
      description = "Number of votes received by each candidate by gender";
      await asyncForEach(election.candidates,async function(candidate){
        // Get all votes for each candidate
        var name = candidate.firstName + ' ' + candidate.lastName;
        try{
          let maleCount = 0, femaleCount = 0, otherCount = 0;
          let votes = await Vote.find({electionID: req.params.electionID, candidate: name, authenticated: true}).exec();
          for (let index = 0; index < votes.length; index++) {
            if(votes[index].demographics.gender == "male")  maleCount++;
            else if(votes[index].demographics.gender == "female") femaleCount++;
            else if(votes[index].demographics.gender == "other")  otherCount++;
          }
          console.log("Total number of gender votes found [male,female,other]: %d,%d,%d", maleCount, femaleCount, otherCount);
          data.push(maleCount);
          labels.push("Male - "+name);
          data.push(femaleCount);
          labels.push("Female - "+name);
          data.push(otherCount);
          labels.push("Other - "+name);
        } catch(err){
          console.log(err);
          res.status(500).send();
          return;
        }
      });
      break;

    case "avgAge":
      description = "Average age of voters for each candidate";
      await asyncForEach(election.candidates,async function(candidate){
        // Get all votes for each candidate
        var name = candidate.firstName + ' ' + candidate.lastName;
        try{
          let sum = 0, avgAge = 0;
          let votes = await Vote.find({electionID: req.params.electionID, candidate: name, authenticated: true}).exec();
          for (let index = 0; index < votes.length; index++) {
            sum += votes[index].demographics.age;
          }
          avgAge = sum/votes.length;
          console.log("Average age found: %f", avgAge);
          data.push(avgAge);
          labels.push(name);
        } catch(err){
          console.log(err);
          res.status(500).send();
          return;
        }
      });
      break;

    case "ageGroup":
      description = "Number of voters per age group";
      let age18To24 = 0, age25To44 = 0, age45To64 = 0, age65Plus = 0;
      try{
        let votes = await Vote.find({electionID: req.params.electionID, authenticated: true}).exec();
        for (let index = 0; index < votes.length; index++){
          if(votes[index].demographics.age <= 24) age18To24++;
          else if(votes[index].demographics.age <= 44) age25To44++;
          else if(votes[index].demographics.age <= 64) age45To64++;
          else age65Plus++;
        }
        console.log("Age groups found [18-24,25-44,45-64,65+]: %d, %d, %d, %d",age18To24,age25To44,age45To64,age65Plus);
        data.push(age18To24);
        data.push(age25To44);
        data.push(age45To64);
        data.push(age65Plus);
        labels.push("18-24");
        labels.push("25-44");
        labels.push("45-64");
        labels.push("65+");
      } catch(err){
        console.log(err);
        res.status(500).send();
        return;
      }
      break;

    case "province":
      let provinceMap = new Map();
      provinceMap.set("British Columbia",0);
      provinceMap.set("Alberta",0);
      provinceMap.set("Saskatchewan",0);
      provinceMap.set("Manitoba",0);
      provinceMap.set("Ontario",0);
      provinceMap.set("Quebec",0);
      provinceMap.set("New Brunswick",0);
      provinceMap.set("Nova Scotia",0);
      provinceMap.set("Prince Edward Island",0);
      provinceMap.set("Newfoundland and Labrador",0);
      provinceMap.set("Yukon",0);
      provinceMap.set("Northwest Territories",0);
      provinceMap.set("Nunavut",0);

      description = "Number of voters from provinces and territories";
      try{
        let votes = await Vote.find({electionID: req.params.electionID, authenticated: true}).exec();
        for (let index = 0; index < votes.length; index++){   // Count votes for each province
          let state = votes[index].demographics.state;
          provinceMap.set(state,(provinceMap.get(state)+1));
        }
        for (var [key, value] of provinceMap.entries()){
          data.push(value);
          labels.push(key);
        }
        console.log(data);
        console.log(labels);
      } catch(err){
        console.log(err);
        res.status(500).send();
        return;
      }
      break;

    case "cities":
      let cityMap = new Map();
      description = "Number of votes from each city";
      try{
        let votes = await Vote.find({electionID: req.params.electionID, authenticated: true}).exec();
	for (let index = 0; index < votes.length; index++){
          let city = votes[index].demographics.city;
          if (typeof cityMap.get(city) == 'undefined'){
            cityMap.set(city, 0);
          } else {
            cityMap.set(city, (cityMap.get(city)+1));
          }
        }
        for (var [key, value] of cityMap.entries()){
          data.push(value);
          labels.push(key);
        }
      } catch(err){
        console.log(err);
        res.status(500).send();
        return;
      }
      break;

    default:
      console.log("Unknown analytic tag");
      res.status(400).send("Unknown analytic tag");
      return;
  }

  if(!updateFlag){
    newAnalytic.dataPoints = data;
    newAnalytic.dataLabels = labels;
    newAnalytic.description = description;
    // Save and return analytics object
    newAnalytic.save(function(err, doc){
      if(err){
        console.log(err);
        res.status(500).send();
      } else{
        res.status(200).json(doc);
      }
    });
  } else {
    Analytics.findById(id, function(req, analytic){
      analytic.dataPoints = data;
      analytic.dataLabels = labels;
      analytic.save(function(err, doc){
        if(err){
          console.log(err);
          res.status(500).send();
        } else{
          res.status(200).json(doc);
        }
      });
    });
  }

});

module.exports = router;
