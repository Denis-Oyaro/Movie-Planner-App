
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;
    $greeting.text("So you want to live at " + address + "?");
    var imgLink = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address.replace(/ /g,"%20");
    $body.append('<img class="bgimg" src=' + imgLink + '>');
    

    //AJAX request to NYT API
    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
    var data = {
        'api-key': 'e996f9200cb941efbfb9a20f95c49c28',
        q: city, 
        begin_date: '20180623'       
    };
    $.getJSON(nytUrl, data, function(data){
        var items = [];
        for (var i = 0; i < data.response.docs.length; i++){
            var article = data.response.docs[i];
            items.push( "<li class='article'>" + '<a href="' + article.web_url + '">' + article.headline.main + '</a>'
            + '<p>' + article.snippet + "</p></li>" );
        }
        
        $nytElem.append( items.join("") );   
    }).fail(function(){
        $nytHeaderElem.text('New York Times Article Could Not Be Loaded.');
        $('#wikipedia-header').text('');
    });
    
    //for error handling
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('failed to get wikipedia resources');   
    }, 8000);
    
    //AJAX's JSONP request for wiki api
    $.ajax("https://en.wikipedia.org/w/api.php", {
     
        // Tell jQuery we're expecting JSONP
        dataType: "jsonp",
     
        // Tell wiki api what we want and that we want JSON
        data: {
            format: "json",
            action: "opensearch",
            search: city
        },
     
        // Work with the response
        success: function( data ) {
            articleList = data[1];
            for (var i = 0; i<articleList.length; i++){
                var liStr = '<li><a href="http://en.wikipedia.org/wiki/' + articleList[i] + '">' + articleList[i] +
                '</a></li>';
                $wikiElem.append(liStr);    
            }
            
            //no need for timeout because request a success
            clearTimeout(wikiRequestTimeout);
        }
    });
    
    return false;
};

$('#form-container').submit(loadData);
