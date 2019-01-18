let friendsData = require('../data/friends.js');
let noMatch = require('../data/nomatch');
let fs = require('fs');
module.exports = function(app){
    app.get('/api/friends',function(req,res){
        res.json(friendsData);
    });
    
    app.post('/api/friends',function(req,res){
        let currentUser = req.body;
        let allScores = [];
        let lowestIndex = 0;
        let exist = false;
        for(var i=0;i<friendsData.length;i++){
            let result = 0;
            if(currentUser.email === friendsData[i].email){
                exist = true;
                allScores.push(100);
                continue;
            }
            for(var j=0;j<currentUser.scores.length;j++){
                result += friendsData[i].scores[j] - currentUser.scores[j];
            }
            result = Math.abs(result);
            if(allScores.length == 0){
                lowestIndex = i;
                allScores.push(result);
            }else{
                if(result <= allScores[lowestIndex]){
                    lowestIndex = i;
                }
                allScores.push(result);
            }
            
        }
        if(friendsData.length > 0 && !exist){
            friendsData.push(currentUser);
        }else if(friendsData.length == 0){
            friendsData.push(currentUser);
        }
        let fileString = 'let friends ='+JSON.stringify(friendsData)+';\nmodule.exports = friends;';
        fs.writeFile('./app/data/friends.js',fileString,function(err){
            if(err) throw err;
        })
        if(allScores.length > 0 && allScores[lowestIndex] <=5){
            res.json(friendsData[lowestIndex]);
        }else{
            res.json(noMatch);
        }
    });
}