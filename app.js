var request = require('request');
var fs = require('fs');

var user = {
  ids: [{user: 'zincink', skip: 0}]
}

var options = {
  uri: 'http://canv.as/public_api/users/',
  host: 'http://canv.as',
  path: '/public_api/users/',
  method: 'POST',
  body: JSON.stringify(user)
}

request(options, function(err, res, body){
  var body = JSON.parse(body);
  console.log(body);

  body.users[0].posts.map(function(post){

      request(post.api_url, function(err, res, body){
        var body = JSON.parse(body);
        if(typeof(body.reply_content.original) !== 'undefined'){
          var orig = body.reply_content.original.url;
          var ext = orig.slice(-4, orig.length);
          request(orig).pipe(fs.createWriteStream(body.id + ext))
        }
      });

  });
});
