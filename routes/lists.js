var express = require('express');
var List = require('../models/list.js');

var router = express.Router();

function createList(req, res){
  var tempList = new List.model({
    title: req.body.title,
    description: req.body.description,
    questions: [],
    votes: []
  });
  tempList.save(function(err, data){
    if(err) res.send({status:400, data:null, message:err});
    res.send({list:tempList});
  });
}

function readLists(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  List.model.find({},function(err, users){
    var userMap = {};
    users.forEach(function(user){
      userMap[user._id] = user;
    })
    if(err) return res.send({status:400, data:null, message:err});
    else return res.send({status:200, data:userMap, message:"Fetching Lists"});
  });
}
function readList(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  List.model.findOne({title:req.params.title},function(err, data){
    res.send(data);
  });
}

function addQuestion(req, res){
  List.model.findOne({_id:req.body._id},function(err, data){
    var optionsobj = [];
    for(var i = 0; i < req.body['option[]'].length; i++){
      optionsobj.push({
        votes: 0,
        answer: req.body['option[]'][i],
        history: []
      })
    }

    data.questions.push({
      title: req.body.title,
      answers: optionsobj,
      description: req.body.description,
    })
    data.save();
  res.redirect('/')
  });
}

function deleteList(req, res){
  List.model.findOne({_id:req.params._id}).remove(function(err){
    if(err) res.send({status:400, data:null, message:err});
    return res.send({'response':'deleted '+req.params._id})
  });
}

router.get('/delete/:_id', deleteList);
router.get('/:title', readList);
router.post('/', createList);
router.get('/', readLists);
router.post('/question', addQuestion);

module.exports = router;
