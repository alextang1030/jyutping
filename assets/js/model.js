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
    console.log(stringLength);
  	for (var i  = 0; i < stringLength; i++) {
  		charCode = target.charCodeAt(i);
  		if (127 < charCode) {
  			var temp = escape(target.charAt(i));
        console.log(temp);
  			result += temp.replace('%u', 'U+');
  		} else {
  			result += target.charAt(i);
  		}
  	}
  	return result;
  },
  searchForPron : function(find,callback){
    $set = jyutPing;
    google.load('visualization', '1', {
        callback: function () {
            var query = new google.visualization.Query($set.dataUrl());
            query.setQuery("select * where B = '"+$set.toUnicode(find.trim())+"'");
            query.send(callback);
        }
    });
  },
  searchForChar : function(find,callback){
    $set = jyutPing;
    google.load('visualization', '1', {
        callback: function () {
            var query = new google.visualization.Query($set.dataUrl());
            query.setQuery("select * where D = '"+find+"'");
            query.send(callback);
        }
    });
  },
  searchCallback : function(response){
    console.log("callback");
    console.log(response.getDataTable());
  }
}
