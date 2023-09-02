var express = require('express');
var router = express.Router();
var multer = require('multer');

var path = require('path');

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },
  filename: (req, file, cb) => {
    console.log('file.fieldname', file.fieldname);
    console.log('file.mimetype', file.mimetype);
    console.log('file', file);

    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
});

let fileFilter = (req, file, callback) => {
  let ext = path.extname(file.originalname);

  if (ext !== '.png' && ext !== '.jpg') {
    return callback(new Error('Only png and jpg files are accepted'));
  } else {
    return callback(null, true)
  }
};

var upload = multer({storage, fileFilter: fileFilter})

router.get('/', (req, res, next) => {
  if (req.session.imageFiles === undefined) {
    res.sendFile(path.join(__dirname, '..', '/public/html/index.html')); 
  } else {
    res.render('index', {images: req.session.imageFiles, title: 'Sorting images'})
  }
});

router.post('/upload', upload.array('images'), (req, res) => {
  let files = req.files;
  let imgNames = [];

  for(file of files) {
    let index = Object.keys(file).findIndex((e) => e === 'filename');
    imgNames.push(Object.values(file)[index]);
  }

  req.session.imageFiles = imgNames;

  res.redirect('/');
});

module.exports = router;