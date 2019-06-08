require('dotenv').config()
const Sequelize = require('sequelize');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const slugify = require('slugify');
const marked = require('marked');

// .env
const PORT = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'jwtsecretkey'
const DB_HOST= process.env.DB_HOST || 'localhost';
const DB_USER= process.env.DB_USER || 'warren';
const DB_PW= process.env.DB_PW || 1234;
const DB_NAME= process.env.DB_NAME || 'codingtodo';
const DB_PORT= process.env.DB_PORT || 5432;

// Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
    host: DB_HOST,
    dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
      Articles.sync().then(() => {
          Users.sync().then(() => {
              console.log('Connection has been established successfully.');
          })
      })

  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Articles = sequelize.define('articles',
    {
        article: {
            type: Sequelize.JSON,
            allowNull: false
        },
        topic:{
            type: Sequelize.TEXT,
            allowNull: false
        },
        author: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        slug:{
            type: Sequelize.TEXT,
            allowNull: false
        }

    },
    {
        tableName: 'articles',
        timestamps: true,
        paranoid: true
    }
);

const Users = sequelize.define('users',
    {
        email: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        admin:{
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        other: {
            type: Sequelize.JSON,
            allowNull: true
        }

    },
    {
        tableName: 'users',
        timestamps: true
    }
);

const getAllArticles = () => {
    return Articles.findAll();
};
const getArticleQuery = (obj) => {
    if (typeof obj !== 'object'){
        return Error('arguement must be an object')
    }
    return Articles.findAll(
            {
                where: obj
            }

        );
};

// bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 12;

// jwt
const jwt = require('jsonwebtoken');

const parseCookie = (cookie) => {
    if(cookie){
        if(cookie.includes('token')){
            return cookie
            .split(';')
            .map(item => (item.trim()))
            .filter(item => (item.includes('token')))
            [0].split('=')
            .pop();
        }
        return;
    }
    return;
}

const isLoggedIn = (req, res, next) => {
    if(req.headers.cookie){
        let cookie;
        cookie = parseCookie(req.headers.cookie)
        if(cookie){
            cookie = jwt.verify(cookie, jwtSecret)
            if(cookie.admin){
                res.locals.isLoggedIn = true;
                res.locals.isAdmin = true;
                next();
            }else{
                res.locals.isLoggedIn = true;
                res.locals.isAdmin = false;
                next()
            }
        }else{
            res.locals.isLoggedIn = false;
            res.locals.isAdmin = false;
            next();
        }
    }
    else{
        res.locals.isLoggedIn = false;
        res.locals.isAdmin = false;
        next();
    }
};

const validateAdminToken = (req, res, next) => {
    let cookie;
    cookie = parseCookie(req.headers.cookie)
    if(cookie){
        cookie = jwt.verify(cookie, jwtSecret)
        if (cookie.admin){
            next();
        }else{
            return res.cookie('token', '').status(401).redirect('/login')
        }
    }else{
        return res.cookie('token', '').status(401).redirect('/login')
    }
};

const validateToken = (req, res, next) => {
    if(req.headers.cookie){
        let cookie;
        cookie = parseCookie(req.headers.cookie)
        cookie = jwt.verify(cookie, jwtSecret)
        if (cookie.admin){
            return res.cookie('token', '').status(401).redirect('/login')
        }else{
            next();
        }
    }else{
        return res.cookie('token', '').status(401).redirect('/login')
    }
};

app.use('/', isLoggedIn)
app.use('/admin', validateAdminToken);
app.use('/dashboard', validateToken);


// Express
const views = __dirname + '/public/views';

app.use('/', express.static('./'));
app.use('/static', express.static('public'));

app.set('views', views);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


const shortDate = (data) => {
    data = data.map(article => (
        article.dataValues
    ));
    data.map(item => (
        item.createdAt = item.createdAt.toDateString()
    ))
    data.map(item => (
        item.updatedAt = item.updatedAt.toDateString()
    ))
    return data;
};

// ROUTES
// GET
app.get('/', (req, res) => {
    res.render('main', {file: 'todo', isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin});
})
app.get('/why', (req, res) => {
    res.render('main', {file: 'why', isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin});
})
app.get('/blog', async (req, res) => {
    let data = await getAllArticles()
    data = shortDate(data)
    res.render('main', {file: 'blogs', data, isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin});
})
app.get('/blog/:topic', async (req, res) => {
    let data = await getArticleQuery({topic: req.params.topic});
    data = shortDate(data)
    // use router for these
    res.render('main', {file: 'blogs', data, isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin});
})
app.get('/blog/:topic/:slug', async (req, res) => {
    let data = await getArticleQuery({
        topic: req.params.topic,
        slug: req.params.slug
    });
    data = shortDate(data)
    // use router for these
    return res.render('main', {
        file: 'article',
        data: data,
        content: marked(data[0].article.blog.trim()),
        isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin
    });
})
app.get('/admin', async (req, res) => {
    let users = await Users.findAll();
    users = users.length
    let blogData = await getAllArticles()
    blogData = shortDate(blogData)
    res.render('main', {file: 'admin', blogData, users, isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin})
    // user router for these routes
})
app.get('/admin/add-blog', (req, res) => {
    res.render('main', {file: 'addBlog', result: '', isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin});
})
app.get('/admin/edit-blog/:slug', async (req, res) => {
    let blogData = await Articles.findOne({
            where: {
                slug: req.params.slug
            }
    })
    res.render('main', {
        file: 'editBlog',
        result: '',
        title: blogData.dataValues.article.title,
        topic: blogData.dataValues.article.topic,
        content: blogData.dataValues.article.blog,
        isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin
    });
})
app.get('/admin/delete-blog/:slug', async (req, res) => {
    let blogData = await Articles.findOne({
        where: {
            slug: req.params.slug
        }
    });
    res.render('main', {
        file: 'deleteBlog',
        result: '',
        title: blogData.dataValues.article.title,
        topic: blogData.dataValues.article.topic,
        content: blogData.dataValues.article.blog,
        isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin
    });
})
app.get('/login', (req, res) => {
    res.render('main', {file: 'login', error: '', isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin});
})
app.get('/register', (req, res) => {
    res.render('main', {file: 'register', error: '', isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin});
});
app.get('/dashboard', (req, res) => {
    // regular users
    // no login necessary (but available), track by IP address
    // let them have a shareable link to share list w/ people or themselves
    // store their stuff in db by some sort of ID
    // shows projects containing todo lists
    // tile view, or list view
    // let them load the data from a previous shareable link to continue working on it (or navigate directly to that link to continue working on it)
    res.render('main', {file: 'dashboard', isLoggedIn: res.locals.isLoggedIn, isAdmin: res.locals.isAdmin})
})
app.get('/logout', (req, res) => {
    return res.cookie('token', '').status(200).redirect('/login')
})

// POST
app.post('/login', (req, res) => {
    Users.sync()
        .then(() => {
            return Users.findOne({
                where:{
                    email:req.body.email
                }
            })
        })
        .then((user) => {
            if(user){
                bcrypt.compare(req.body.password, user.password, (err, pwValid) => {
                    if (err){
                        return Error(err)
                    };
                    if(pwValid){
                        if(user.dataValues.admin){
                            jwt.sign({
                                        id: user.dataValues.id,
                                        admin: user.dataValues.admin
                                    },
                                    jwtSecret, (err, token) => {
                                        return res.cookie('token', token).redirect('/admin')
                                    })
                        }
                        jwt.sign({
                                    id: user.dataValues.id,
                                    admin: user.dataValues.admin
                                },
                                jwtSecret, (err, token) => {
                                    return res.cookie('token', token).redirect('/dashboard')
                                })
                    }
                    else{
                        res.render('main', {file: 'login', error: 'Could not login'})
                    };
                })
            }else{
                res.render('main', {file: 'login', error: 'Could not login'})
            }
        })
});
app.post('/register', (req, res) => {
    if(req.body.password === req.body.confirmpassword){
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            Users.sync()
                .then(
                    Users.findOrCreate({
                        where: {
                            email: req.body.email
                        },
                        defaults: {
                            password: hash,
                            admin: false,
                            other: {}
                        }
                    })
                    .spread((user, created) => {
                        if (created){
                            jwt.sign({
                                        id: user.dataValues.id,
                                        admin: user.dataValues.admin
                                    },
                                    jwtSecret, (err, token) => {
                                        return res.cookie('token', token).redirect('/dashboard')
                                    })
                        }else{
                            res.render('main', {file: 'register', error: 'Email is already registered'})
                        }
                    })
                )
                .catch(err => {
                    return Error(err);
                })
        });
    }else{
        res.render('main', {file: 'register', error: 'Passwords did not match'})
    }

});
app.post('/admin', (req, res) => {
    if(Object.values(req.body)[0].toLowerCase() === 'edit'){
        res.redirect(`/admin/edit-blog/${Object.keys(req.body)[0]}`);
    }else if(Object.values(req.body)[0].toLowerCase() === 'delete'){
        res.redirect(`/admin/delete-blog/${Object.keys(req.body)[0]}`);
    }
});
app.post('/admin/add-blog', (req, res) => {
    Articles.create({
                topic: req.body.topic.toLowerCase(),
                article: req.body,
                author: 'Warren John',
                slug: slugify(req.body.title).toLowerCase()
            })
        .then(response => {
            res.render('main', {file: 'addBlog', result: 'Blog published!'})
        })
        .catch(err => {
            res.render('main', {file: 'addBlog', result: 'The blog could not be published.'})
        })
})
app.post('/admin/edit-blog/:slug', (req, res) => {
    Articles.findOne({
        where:{
            slug: req.params.slug
        }
    })
    .then((article) => {
        article.update({
            article: req.body,
            topic: req.body.topic,
            slug: slugify(req.body.title).toLowerCase()
        })
        res.redirect('/admin')
    })
    .catch(err => {
        return Error(err);
    });

})
app.post('/admin/delete-blog/:slug', (req, res) => {
    Articles.findOne({
        where:{
            slug: req.params.slug
        }
    })
    .then((article) => {
        article.destroy()
        res.redirect('/admin')
    })
    .catch(err => {
        return Error(err);
    });

})

app.listen(PORT, () => {
    console.log('\n\nExpress server running on Port:', PORT, '\n\n');
})
