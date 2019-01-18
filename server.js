let express = require('express');
let app = express();
let PORT = process.env.PORT || 7500;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

require('./app/routing/apiRoutes')(app);
require('./app/routing/htmlRoutes')(app);

app.listen(PORT,function(){
    console.log('App is listening on port '+PORT);
})

