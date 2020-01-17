const express = require('express');
const PORT =process.env.PORT || 8080;
//same way to pick up express as forex html
let app = express(); //app =server
//app.use() use= everything goes  through , listening all
//app.get()
//app.post()

//req and res are the same as before, next=continue listen next
app.use((req,res,next)=>{

    console.log('PATH: '+ req.path);
    next();

});

app.get('/', (req, res,next) => {
    res.send ('Hello World 3')
    //res.write();
    //res.end(); End need to be with write
});

app.use((req, res, next)=>{
    res.status(404)
    res.send('page not found');
});
//shutdouwn ctrl+c
app.listen(PORT);
