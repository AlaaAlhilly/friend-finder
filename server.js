//create express object
let express = require('express');
let app = express();
//define our server port
let PORT = process.env.PORT || 7500;
//middle ware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//calling the routing functions
require('./app/routing/apiRoutes')(app);
require('./app/routing/htmlRoutes')(app);
//listen to the port
app.listen(PORT,function(){
    console.log('App is listening on port '+PORT);
})

