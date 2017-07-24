//---------------------- MODULOS ---------------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs')
const db = mongojs('jsgame', ['users']);
const ObjectId = mongojs.ObjectId;
// ------ UPLOAD IMAGE ----
const multer  = require('multer');
const storageImg = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'public/upload/')
  },
  filename: (req, file, cb)=>{
    cb(null, file.fieldname + '-' + Date.now() + "." + file.originalname.split('.')[1] )
  }
});

const upload = multer({ storage: storageImg });
const app = express();
/*
const logger = (req, res, next)=>{
    console.log('Logging...');
    next();
}
app.use(logger);
*/

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Global var
app.use((req, res, next)=>{
  res.locals.errors = null;
  next();
})

//------------------ UPLOAD TEST ------------------------------------





// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Express-Validator
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//--------------------------ROTAS-------------------------------------
app.get('/', (req, res)=>{
    //Get users from MongoDB
    /*
    db.users.find((err, docs)=>{
        console.log(docs); // Just a test
        res.render('index', {
            title: 'Code',
            users: docs //send them to the interface
        });
    });
    */
    
});
app.get('/adm', (re, res)=>{
    //Get users from MongoDB
    db.users.find((err, docs)=>{
        console.log(docs); // Just a test
        res.render('index', {
            title: 'Code - ADM',
            users: docs //send them to the interface
        });
    });
});
app.post('/users/add', upload.any(),(req, res)=>{
    
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors){
      db.users.find((err, docs)=>{
        res.render('index', {
            title: 'Code',
            users: docs, //send them to the interface
            errors: errors
        });
      });
    }else{
        var newUser = {
           first_name : req.body.first_name,
           last_name  : req.body.last_name,
           email      : req.body.email,
           path_img   : req.files[0].path
        }
        db.users.insert(newUser, (err, result)=>{
            if(err){
                console.log(err);
            }
            res.redirect('/');
        });
    }
});
app.delete('/users/delete/:id',(req, res)=>{
    db.users.remove({_id: ObjectId(req.params.id)}, (err, result)=>{
        if(err){
            console.log(err);
        }
        res.redirect('/');
    })
});

app.listen(process.env.PORT, () =>{
    console.log("Running");
});

/*
const http = require('http');
const fs = require('fs');

fs.readFile('desktop.html', (err, html)=>{
    if(err){
        throw err;
    }
    
    const server = http.createServer((req, res)=>{
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/html');
        res.write(html)
        res.end();
    });
    
    server.listen(process.env.PORT, process.env.IP, ()=>{
        console.log('Server started on port ' + process.env.PORT);
    })
});
*/