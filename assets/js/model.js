var jyutPing = {
  sheet_id : "1oPSzxFPYCQaja_C-mAi5nu-thceSQc3LzXEnkLthSy4",
  api_key : "AIzaSyBdJsthRvTU2R6NqTp-Ty9v53Smza3IduE",
  gid : 0,
  headers : 1,
  start : "A1",
  end: "G",
  dataUrl : function(){
    $set = jyutPing;
    var base_url = "https://docs.google.com/spreadsheets/d/";
    base_url += $set.sheet_id;
    base_url += "/gviz/tq?";
    base_url += "key="+$set.api_key;
    base_url += "&tqx=out:html";
    base_url += "&tq?gid="+$set.gid;
    base_url += "&headers="+$set.headers;
    base_url += "&range="+$set.start+":"+$set.end;
    return base_url;
  },
  toUnicode : function(target){
    var result = "";
    var stringLength = target.length;
  	var charCode = 0;
  	for (var i  = 0; i < stringLength; i++) {
  		charCode = target.charCodeAt(i);
  		if (127 < charCode) {
  			var temp = escape(target.charAt(i));
  			result += temp.replace('%u', 'U+');
  		} else {
  			result += target.charAt(i);
  		}
  	}
  	return result;
  },
  searchForPron : function(find,callback){
    $set = jyutPing;
    $set.customercallback = callback;
    google.load('visualization', '1', {
        callback: function () {
            var query = new google.visualization.Query($set.dataUrl());
            query.setQuery("select * where B like '%"+$set.toUnicode(find.trim())+"%'");
            query.send($set.searchCallback);
        }
    });
  },
  searchForChar : function(find,callback){
    $set = jyutPing;
    $set.customercallback = callback;
    google.load('visualization', '1', {
        callback: function () {
            var query = new google.visualization.Query($set.dataUrl());
            query.setQuery("select * where D like '%"+find.trim()+"%'");
            query.send($set.searchCallback);
        }
    });
  },
  customercallback : function(response){},
  searchCallback : function(response){
    var data = {
      response_code : 0,
      response_msg : "",
      response_data : []
    };
    if (!response.getDataTable().Nf.length)
    {
      data.response_code = 1;
      data.response_msg = "data not found";
    }
    else {
      $.each(response.getDataTable().Nf,function(key,value){
        data.response_data.push({
          "data_char": (value.c[0] === null) ? "": value.c[0].v,
          "data_english": (value.c[2] === null) ? "": value.c[2].v,
          "data_pron": (value.c[3] === null) ? "": value.c[3].v,
          "data_source": (value.c[4] === null) ? "": value.c[4].v,
          "data_words": (value.c[5] === null) ? "": value.c[5].v,
          "data_senses": (value.c[6] === null) ? "": value.c[6].v
        });
      });
    }
    $set.customercallback(data);
  }
}
