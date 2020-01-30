const express = require('express');
const PORT = process.env.PORT || 8080;
const body_parser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const list_schema = new Schema({
    name: {
        type: String,
        required: true,
        //user: user_schema // is it ok?
    },
   // childrenProduct_schema :[product_schema] //addig inside 01
});
const user_schema = new Schema({
    name: {
        type: String,
        required: true
        
    //shoppinglist:{
       // type: list_schema,
       // required: true,
      //          }
    },
    childrenList_schema :[list_schema] //addig inside 30.01
});

const product_schema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true  
    },

   // picture: {
   //     type: jpg,
   //     required: true  
   // }
   
});

const user_model = mongoose.model('user', user_schema);
const list_model = mongoose.model('list', list_schema);
const product_model = mongoose.model('product', product_schema);

let app = express();

app.use(body_parser.urlencoded({
    extended: true
}));

app.use(session({
    secret: '1234qwerty',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000000
    }
}));

let users = [];
let lists = [];
//if needed own product list
let products =[]

app.use((req, res, next) => {
    console.log(`path: ${req.path}`);
    next();
});

const is_logged_handler = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

app.get('/', is_logged_handler, (req, res, next) => {
    const user = req.session.user; //written in the page
   // const list = req.session.list; //added 27.01
    //trying to print all 
    

    res.write(`
    <html>
    <body>
        Logged in as user: ${user.name} 
        Your lists: ${user.childrenList_schema} //what it will show?
        
        <form action="/add-list" method="POST">
        <input type="text" name="list_name">
        <button type="submit" class="add_button">Add list</button>
    </form>



        <form action="/logout" method="POST">
            <button type="submit">Log out</button>
        </form>
    </html>
    </body>
    `);
    res.end();
});

app.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/login', (req, res, next) => {
    console.log('user: ', req.session.user)

    user_model.find()
    .then((name) => {
        console.log(name)
    });
    res.write(`
    <html>
    <body>
       Hello ! How are you today?)
        <form action="/login" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Log in</button>
        </form>
        <form action="/register" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Register</button>
        </form>
    </body>
    <html>
    `);
    res.end();
});

app.post('/login', (req, res, next) => {
    const user_name = req.body.user_name;
    
    user_model.findOne({
        name: user_name
    }).then((user) => {
        if (user) {
            req.session.user = user;
    
            
           // req.session.list = list;//to check
            return res.redirect('/');
                  }

        res.redirect('/login');
    });
    
});

app.post('/register', (req, res, next) => {
    const user_name = req.body.user_name;

    user_model.findOne({
        name: user_name
    }).then((user) => {
        if (user) {
            console.log('User name already registered');
            return res.redirect('/login');
        }

        let new_user = new user_model({
            name: user_name
            
        });

        new_user.save().then(() => {
            return res.redirect('/login');
        });

        

    });
});
app.post('/add-list', (req, res, next) => {
    const list_name = req.body.list_name;
    const user = is_logged_handler;

    //searching in users array
    //user_model.findOne({
    //    childrenList_schema: list_name


    //user_model.list_model.findOne({

   list_model.findOne({
       name: list_name
    }).then((list) => {
        if (list) {
            console.log('List name already registered');
            return res.redirect('/'); //another way where to redirect
        }

        let new_list = new list_model({
        //let new_list = new user.model.list_model({   
        name: list_name
            
        });

        //new_list.save().then(() => {
        //    return res.redirect('/');
        //});

       
       // user.childrenList_schema.push(new_list);
       //how to understand is it working or not?
        user_model.updateOne(
            {$push:{childrenList_schema: new_list}}
        );

        new_list.save().then(() => {
           return res.redirect('/');
        });
        

    });
});

app.use((req, res, next) => {
    res.status(404);
    res.send(`
        page not found
    `);
});

//Shutdown server CTRL + C in terminal

const mongoose_url = 'mongodb+srv://memoappdb:kcggD3xODFWO7xZs@cluster0-i69qr.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoose_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('Mongoose connected');
    console.log('Start Express server');
    app.listen(PORT);
});