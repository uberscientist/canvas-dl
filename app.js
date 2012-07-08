var request = require('request');
var fs = require('fs');

var username = 'yipyip';
var offset = 0;
var limiting = null;

var waitLonger = 0;
var picCount = 0;


function startInterval(posts, c){
  var c = c || -1;

  limiting = setInterval(function(){
    c++;
    console.log(c + ': wait:' + waitLonger);

    //Check out each of the posts
    request(posts[c].api_url, function(err, res, body){
      var body = JSON.parse(body);

      if(body.success == false){
        console.log('Too fast in post check interval');
        increaseInterval(posts, c);
        console.log(body);
      }

      else if(typeof(body.reply_content.original) !== 'undefined'){
        picCount ++;
        console.log('Image Post... downloading:' + picCount);
        var orig = body.reply_content.original.url;
        var ext = orig.slice(-4, orig.length);
        request(orig).pipe(fs.createWriteStream('./pics/'+ body.id + ext))
      }

      else {
        console.log('Text Post');
      }

    });

    if(c == posts.length - 1){
      console.log('Next 10 posts!!!!!!!!!!!!1');

      //Increase our offset length for our next loop
      if(posts.length == 10){
        offset += 10;
      }

      clearInterval(limiting);
      limiting = null;
      getImages(offset);
    }
  }, 500 + waitLonger);
}

function increaseInterval(posts, c){
  c--;
  waitLonger += 200;
  clearInterval(limiting);
  limiting = null;
  startInterval(posts, c);
}


function getImages(offset){

  if(!limiting){
    if(waitLonger > 0){
      waitLonger -= 100;
    }
    console.log('offset: ' + offset);
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

      if(body.success == false){
        //We've gone over our limit, need to slow down
        console.log(body);

      } else {

        //Pass the posts to the interval function
        var posts = body.users[0].posts;
        startInterval(posts);

      }
    });
  } else {
    console.log('*************************shouldnt happen*************************');
  }

}

getImages(offset);
