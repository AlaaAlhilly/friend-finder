//an object will contain the saved people data
let friendsData = require('../data/friends.js');
//an object will contain the no-match data
let noMatch = require('../data/nomatch');
let fs = require('fs');

module.exports = function(app){
    //direct the user to json data we have
    app.get('/api/friends',function(req,res){
        res.json(friendsData);
    });
    
    app.post('/api/friends',function(req,res){
        //the current user data just received from the survey form
        let currentUser = req.body;
        //an array to keep all comparing results between the current user and
        //saved people
        let allScores = [];
        //a variable to keep the lowest result index 
        let lowestIndex = 0;
        //if the current user already saved so we don't have to process his data in the
        //matching process, to know if the user exist i used email field to see if this user
        //already saved before
        let exist = false;
        //loop through the friends saved before
        for(var i=0;i<friendsData.length;i++){
            //a result variable for each person in the saved data
            let result = 0;
            //check if this user is already saved
            if(currentUser.email === friendsData[i].email){
                //if yes then pass him 
                exist = true;
                //put high score for this user so it won't count 
                allScores.push(100);
                continue;
            }
            //loop through the score values 
            for(var j=0;j<currentUser.scores.length;j++){
                //add up the subtraction between each value of the user and the saved people
                result += friendsData[i].scores[j] - currentUser.scores[j];
            }
            //remove the negative sign if there is one
            result = Math.abs(result);
            //if the scores results arrary is empty just push into it
            if(allScores.length == 0){
                //assume the first index is the lowest result
                lowestIndex = i;
                //and save the result in the array results
                allScores.push(result);
            //if the results array is not empty then check the lowest result 
            }else{
                // if the new result less than the lowest result in the results array
                if(result < allScores[lowestIndex]){
                    //then replace the lowest index with the new index
                    lowestIndex = i;
                }
                //then push the result to the array
                allScores.push(result);
            }
            
        }
        //if the saved friends is not empty and the current user is not saved before
        if(friendsData.length > 0 && !exist){
            //then push the current user data to the saved people
            friendsData.push(currentUser);
        //if it is empty
        }else if(friendsData.length == 0){
            //just push the current user into the array
            friendsData.push(currentUser);
        }
        //update the friend.js file with the new data to be saved
        let fileString = 'let friends ='+JSON.stringify(friendsData)+';\nmodule.exports = friends;';
        fs.writeFile('./app/data/friends.js',fileString,function(err){
            if(err) throw err;
        });
        //if the results array is not empty and the lowest result is less than 5
        //then we found a match for the user
        if(allScores.length > 0 && allScores[lowestIndex] <=5){
            //send the match person to the survey page
            res.json(friendsData[lowestIndex]);
        //if not
        }else{
            //send noMatch object which contain a message to tell the user
            //that we couldn't find him a match
            res.json(noMatch);
        }
    });
}