let path = require('path');

module.exports = function(app){
    //direct the user to the home page
    app.get('/',function(req,res){
        res.sendFile(path.join(__dirname,'../public/home.html'));
    });
    //direct the user to the survey page
    app.get('/survey',function(req,res){
        res.sendFile(path.join(__dirname,'../public/survey.html'));
    })
}