

$(document).ready(function(){
  $("#pron-to-char").on('submit',function(e){
    e.preventDefault();
    var code = $("#search-pron").val();
    jyutPing.searchForChar(code,function(response){
      if (!response.getDataTable().Nf.length)
      {
        alert("not found!");
        return false;
      }
      $("#pron-result").empty();
      $.each(response.getDataTable().Nf,function(key,value){
        console.log(value);
        $("#pron-result").append(
          $("<div/>")
            .append($("<div/>").html("Char:"+value.c[0].v))
            .append($("<div/>").html("pron:"+value.c[3].v))
            .append($("<div/>").html("source:"+value.c[4].v))
        );
      });
    });
  });

  $("#char-to-pron").on('submit',function(e){
    e.preventDefault();
    var code = $("#search-char").val();
    jyutPing.searchForPron(code,function(response){
      if (!response.getDataTable().Nf.length)
      {
        alert("not found!");
        return false;
      }
      $("#char-result").empty();
      $.each(response.getDataTable().Nf,function(key,value){
        console.log(value);
        $("#char-result").append(
          $("<div/>")
            .append($("<div/>").html("Char:"+value.c[0].v))
            .append($("<div/>").html("pron:"+value.c[3].v))
            .append($("<div/>").html("source:"+value.c[4].v))
        );
      });
    });
  });
});
