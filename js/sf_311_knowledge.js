

var request_url = "https://data.sfgov.org/resource/hrr4-hjc6.json?$where=may > 10";
  console.log(request_url)
  
$.getJSON(request_url
    , function(data){
    	for (i in data){ 
    	$('#topten').append('<p>'+data[i].knowledge_base_article_title+': '+data[i].may+'</p>');
    	}
    }
 );


