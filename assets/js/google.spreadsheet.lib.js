
(function(){
  var setting = {
    "api_key": "",
    "client_id" : "",
    "header":0,
    "gid":0,
    "ranges":"",
    "columns":{}
  };
  var ids = {};
  this.SpreadsheetsModel = function(options){
    setting = Object.assign(setting,options);

    for(var key in setting.columns)
    {
      ids[setting.columns[key]] = key;
    }
    this.query_str = "";    this.selection = ""; this.wherecase = "";
    this.group_by = ""; this.order_by = ""; this.limit_num = 0;
    this.offset = 0; this.hasParentheses = false;

    var googlApi = document.querySelector('script[src="https://www.google.com/jsapi"]');

    if (!googlApi)
    {
      console.log("Error: This plugin require google api, please add the following script in <head>");
      console.log('<script type="text/javascript" src="https://www.google.com/jsapi" ></script>');

    }
  }

  SpreadsheetsModel.prototype.setRanges = function(ranges) { // Table ranges. eg: A:AA
    setting.ranges = ranges;
    return this;
  }
  SpreadsheetsModel.prototype.setHeader = function(header) { // Rows number
    setting.header = header;
    return this;
  }
  SpreadsheetsModel.prototype.setSheet = function(gid) { // Sheet id
    setting.gid = gid;
    return this;
  }

  SpreadsheetsModel.prototype.setColumn = function(name,col) {
    setting.columns[name] = col;
    ids[col] = name;
    return this;
  }

  SpreadsheetsModel.prototype.setColumns = function(columns) {
    for(var key in columns) {
      setting.columns[key] = columns[key];
      ids[columns[key]] = key;
    }
    return this;
  }
  SpreadsheetsModel.prototype.getColumn = function(key) {
    try {
      if (typeof setting.columns[key] !== undefined)
      {
        return setting.columns[key];
      }
    } catch(e) {
      console.log("Error: Get Column error["+key+"]:");
      console.log(e.message);
    }
    return key;
  }

  SpreadsheetsModel.prototype.select = function(fields) {
    if (!fields.length)
    {
      console.log("Error: Columns cannot be empty!");
      return this;
    }

    if (typeof fields === "string") {
      if (this.selection != "") this.selection += ",";
      this.selection += fields;
    }
    else {
      var $columns = this.columns;
      for(var key in fields)
      {
        if (this.selection != "") this.selection += ",";
        this.selection += this.getColumn(fields[key]);
      }
    }
    return this;
  }

  SpreadsheetsModel.prototype.where = function(column,value){
    if (this.wherecase != "") this.wherecase += " and ";
    this.wherecase += this.getColumn(column) + "='"+value+"'";
    return this;
  }

  SpreadsheetsModel.prototype.or_where = function(column,value){
    if (this.wherecase != "") this.wherecase += " or ";
    this.wherecase += this.getColumn(column) + "='"+value+"'";
    return this;
  }

  SpreadsheetsModel.prototype.like = function(column,value){
    if (this.wherecase != "") this.wherecase += " and ";
    this.wherecase += this.getColumn(column) + " like '%"+value+"%'";
    return this;
  }

  SpreadsheetsModel.prototype.or_like = function(column,value){
    if (this.wherecase != "") this.wherecase += " or ";
    this.wherecase += this.getColumn(column) + " like '%"+value+"%'";
    return this;
  }

  SpreadsheetsModel.prototype.openParentheses = function() {
    this.wherecase += "(";
    this.hasParentheses = true;
    return this;
  }

  SpreadsheetsModel.prototype.closeParentheses = function() {
    this.wherecase += ")";
    this.hasParentheses = false;
    return this;
  }

  SpreadsheetsModel.prototype.group = function(column){
    if (this.group_by != "") this.group_by += ",";
    this.group_by += this.getColumn(column);
    return this;
  }

  SpreadsheetsModel.prototype.order = function(column,sort){
    if (this.order_by != "") this.order_by += ",";
    this.order_by += this.getColumn(column) +" "+(typeof sort === undefined)? "ASC":sort;
    return this;
  }

  SpreadsheetsModel.prototype.limit = function(limit,offset){
    this.limit_num = (typeof limit === "number") ? limit: 0;
    this.offset = (typeof offset === "number") ? offset: 0;
    return this;
  }

  SpreadsheetsModel.prototype.query = function(query,callback){
    if (typeof query === "string")
    {
      this.query_str = query;
    }
    this.send(callback);
  }

  SpreadsheetsModel.prototype.send = function(callback){
    if (this.query_str == "")
    {
      this.query_str = "select "+ ((this.selection.trim() == "")? "*":this.selection);
      if (this.wherecase != "") this.query_str += " where "+this.wherecase;
      if (this.hasParentheses) this.query_str += ")";
      this.hasParentheses = false;
      if (this.group_by != "") this.query_str += " group by "+this.group_by;
      if (this.order_by != "") this.query_str += " order by "+this.order_by;
      if (this.limit_num > 0) this.query_str += " limit "+this.limit_num;
      this.query_str += " offset "+this.offset;
    }
    var sql = this.query_str;

    this.query_str = "";  this.selection = "";   this.wherecase = "";
    this.group_by = ""; this.order_by = ""; this.limit_num = 0;
    this.offset = 0;

    request(sql,callback);
  }

  SpreadsheetsModel.prototype.clear = function(){
    this.query_str = "";  this.selection = "";   this.wherecase = "";
    this.group_by = ""; this.order_by = ""; this.limit_num = 0;
    this.offset = 0;
  }

  function dataUrl() {
    var url = "https://docs.google.com/spreadsheets/d/";
    url += setting.client_id;
    url += "/gviz/tq?key"+setting.api_key;
    url += "&tqx=out:html&tq?gid="+setting.gid;
    url += "&headers="+setting.header;
    if (setting.ranges != "")
      url += "&ranges="+setting.ranges;

    return url;
  }

  function request(query_str,callback) {
    google.load('visualization', '1', {
        callback: function () {
            var query = new google.visualization.Query(dataUrl());
            query.setQuery(query_str);
            query.send(function(response){
              var data = {
                response_code : 0,
                response_msg : "",
                response_header: {},
                response_data : []
              };
              if (!response.getDataTable().Nf) {
                data.response_code = 1;
                data.response_msg = "data not found";
                callback(data);
                return;
              }
              var header = response.getDataTable().Mf;
              data.response_header = header;
              response.getDataTable().Nf.forEach(function(row){
                var temp = {};

                row.c.forEach(function(v,i){
                  var key = (ids[header[i].id]) ? ids[header[i].id] : header[i].id;
                  temp[key] = (row.c[i]) ? row.c[i].v: "";
                });
                data.response_data.push(temp);
              });
              callback(data);
              return;
            });
        }
    });
  }
  function l2n(string) {
      string = string.toUpperCase();
      var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', sum = 0, i;
      for (i = 0; i < string.length; i++) {
          sum += Math.pow(letters.length, i) * (letters.indexOf(string.substr(((i + 1) * -1), 1)) + 1);
      }
      return sum;
  }


  function toUnicode(target) {
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
  }

}());
