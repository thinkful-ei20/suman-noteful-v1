const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);



describe('Reality check', function () {
  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {
  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

//testing GET method
 it('should get list of notes on  GET',function(){
  return chai.request(app)
    .get('/api/notes')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.be.at.least(10); 
      
      const expectedKeys = ['id','title','content'];
      res.body.forEach(function(item){
        expect(item).to.be.a('object');
        expect(item).to.include.keys(expectedKeys);
      });
    });
});


//testing GET method by ID
it('should get one note on  GET by ID',function(){
  return chai.request(app)
    .get('/api/notes/1000')
    .then(function(res){
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('object');       
      expect(res.body).includes.keys(['id','title','content']);      
    });
});

//testing POST method
  it('should add a note on POST',function(){
    const newItem = {title : 'anything',content : 'something'};
    return chai.request(app)
      .post('/api/notes')
      .send(newItem)
      .then(function(res){
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id','title','content');
          expect(res.body.id).to.not.equal(null);
          expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });
  

//testing delete
it('should delete notes on DELETE',function(){
  return chai.request(app)
    .get('/api/notes')
    .then(function(res){
      return chai.request(app)
        .delete(`/api/notes/${res.body[0].id}`);
    })
    .then(function(res){
      expect(res).to.have.status(204);
    });
});


//testing update item
it('should update notes on PUT',function(){ 
  const updateNotes = {
    title: 'changes title',
    content : 'changes content'
  };

  return chai.request(app)
    .get('/api/notes')
    .then(function(res){            
      updateNotes.id = res.body[0].id;
      return chai.request(app)
        .put(`/api/notes/${updateNotes.id}`)
        .send(updateNotes);
    })
    .then(function(res){
      expect(res).to.have.status(200);      
      expect(res.body).to.be.a('object');      
    });    
});

