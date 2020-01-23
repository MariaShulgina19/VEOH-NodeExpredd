
const express = require('express');
const PORT =process.env.PORT || 8080;
const body_parser=require('body-parser');
//same way to pick up express as forex html

const session =require('express-session') // add block 
let app = express(); //app =server
//app.use() use= everything goes  through , listening all
//app.get()
//app.post()

app.use(session({  //packeges
    secret: '1234qwerty' ,//need to generate btter code
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000000
    }
}));

let users=[];

app.use(body_parser.urlencoded({
    extended: true

}));

//req and res are the same as before, next=continue listen next
app.use((req,res,next)=>{

    console.log('PATH: '+ req.path);
    next();

});
const is_logged_handler = (req, res, next)=>{

    if(!req.session.user) {
       return res.redirect('/login');
    }
    next();
};


app.get('/',is_logged_handler, (req, res, next) =>{
    const user =req.session.user;
    res.write(`
    
    <html>
    <body>
        Logged in as user: ${user}
        <form action ="log out" method "POST">
        
        <button type="submit">Log out</button>
    
    </body>
    </html>
    `);
res.end();
});

app.post('/logout', (req,res, next)=>{
    req.session.destroy();
    res.redirect('/login');
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

app.get('login', (req,res,next) =>{
    console.log('user:', req.session.user)
    res.write(`
    
    <html>
    <body>
        <form action ="login" method "POST">
        <input type="text" name= "user name">
        <button type="submit">Log in</button>
    
      <form action ="register" method "POST">
        <input type="text" name= "user name">
        <button type="submit">Register</button>
    
    </body>
    </html>
    `);

    res.end();
    });
    
    app.post('/login', (req,res, next)=>{
         const user_name= req.body.user_name;
        let user =users.find
    });

    if(user){
        console.log('user logged in',user);
        req.session.user=user;
        return res.redirect('/login')
    }
    console.log('user name is not registere',user);
    res.redirect('login');
    app.post('/register', (req,res, next)=>{
        const user_name= req.body,user_name;
        users.find((name)=>{
            return user_name==name;
    });
    
    if(user){
        return res.send('Use name already registered');
    }
    
    users.push(user_name);
    console.log('users:', users);
    res.redirect('/login');
    });
    
//shutdouwn ctrl+c
app.listen(PORT);
