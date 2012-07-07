var request = require('request');
var fs = require('fs');

var username = 'jiakko';
var offset = 0;


function getImages(offset){

  var offset_json = {
    ids: [{user: username, skip: offset}]
  }

  var options = {
    uri: 'http://canv.as/public_api/users/',
    host: 'http://canv.as',
    path: '/public_api/users/',
    method: 'POST',
    body: JSON.stringify(offset_json)
  }

  request(options, function(err, res, body){
    var body = JSON.parse(body);

    //console.log(body);
    var posts = body.users[0].posts;

    //Increase our offset length for our next loop
    if(posts.length == 10){
      offset += 10;
      setTimeout(getImages(offset), 1000);
    }

    var c = 0;
    var limiting = setInterval(function(){

      request(posts[c].api_url, function(err, res, body){
        var body = JSON.parse(body);
        console.log(body);
        if(typeof(body.reply_content.original) !== 'undefined'){
          var orig = body.reply_content.original.url;
          var ext = orig.slice(-4, orig.length);
          request(orig).pipe(fs.createWriteStream('./pics'+ body.id + ext))
        }
      });

      c++;
      if(c == posts.length) clearInterval(limiting);
    }, 1000);


  });
}

getImages(offset);
