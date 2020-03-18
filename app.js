const methodOverride = require('method-override'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      express = require('express'),
      app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/restful_blog', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

//DB SETUP
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
const Blog = mongoose.model('Blog', blogSchema);

// /
app.get('/', (req, res) => {
    res.redirect('/blogs');
});
//INDEX
app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) =>{
        if(err){
            console.log(err)
        } else {
            res.render('index', {blogs:blogs});
        }
    });
});
//NEW
app.get('/blogs/new', (req, res) => {
    res.render('new');
});
//CREATE 
app.post('/blogs', (req, res) => {
    Blog.create(req.body.blog, (err) =>{
        if(err){
            console.log(err);
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    });
});
//SHOW
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, blog)=>{
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('show', {blog:blog});
        }
    });
});
//EDIT
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, blog)=>{
        if(err){
            res.redirect('/blogs');
        } else {
            res.render('edit', {blog:blog})
        }
    });
});
//UPDATE
app.put('/blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err) =>{
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    });
});
//DELETE
app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndDelete(req.params.id, (err)=>{
        if(err){
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});
// (O)
app.listen(3000, () => {
    console.log('Server running.');
});
app.get('*', (req, res) => {
    res.send('Someone made a boo-boo');
});