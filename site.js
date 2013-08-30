---
---
;{% include js/jquery.min.js %}

function createCallback(i) {
   return function(data) {
     var preview_image = data.sizes.size[5].source;
     window.geojson.features[i].properties['image:href'] = preview_image;
     $("#geojson_output").val( JSON.stringify(window.geojson) );
     request_count--;  
     if (request_count == 0) download();
   };
}

function doIt() {
  geojson = JSON.parse($("#geojson_input").val());
  $('#content').html('');

  request_count = geojson.features.length;
  var flickr_api = "http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=43c27f35a02b6e91c34d1de1590e303d&format=json&format=json&photo_id=";
    
  for (var i=0; i < geojson.features.length; i++) {
    try {
        var match = geojson.features[i].properties.image.match(/http\:\/\/www\.flickr\.com\/photos\/.*?\/(\d+)/);
        $.getJSON(flickr_api + match[1] + "&jsoncallback=?", createCallback(i));
    } catch(err) {
        request_count--;
        if (request_count == 0) download();
    }
  }
}

$( "#doIt" ).click(function() {doIt()});

function download() {
    var blob = new Blob([$("#geojson_output").text()], {type: "application/json"});
    var url  = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.download    = "backup.json";
    a.href        = url;
    a.textContent = "Download groomed-geojson.json";
    document.getElementById('content').appendChild( document.createElement('h2') ).appendChild(a);
   // $('#content').html('<h2><a href="' + url + '" "download="groomed-geojson.json">Download groomed-geojson.json</a></h2>');

    //document.getElementById('content').appendChild(a);
}
