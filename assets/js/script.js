function form_result(target,data)
{
  target.empty();
  $.each(data,function(i,v){
    target.append(
      $("<div/>").addClass("items")
        .append($('<div class="item-char"/>').html("<span>"+v.data_char+"</span>"))
        .append($('<div class="item-pron"/>').html("<label>讀音</label><span>"+v.data_pron+"</span>"))
        .append($('<div class="item-senses"/>').html("<label>詞性</label><span>"+v.data_senses+"</span>"))
        .append($('<div class="item-words"/>').html("<label>配詞</label><span>"+v.data_words+"</span>"))
        .append($('<div class="item-source"/>').html("<label>來源</label><span>"+v.data_source+"</span>"))
        .append($('<div class="item-english"/>').html("<label>英語</label><span>"+v.data_english+"</span>"))
    );
  });
}
var model = new SpreadsheetsModel({
  "api_key":"AIzaSyBdJsthRvTU2R6NqTp-Ty9v53Smza3IduE",
  "client_id":"1oPSzxFPYCQaja_C-mAi5nu-thceSQc3LzXEnkLthSy4",
  "header":1,
  "ranges": "A1:G",
  "columns":{
    "data_char":"A",
    "data_unicode":"B",
    "data_english":"C",
    "data_pron":"D",
    "data_source":"E",
    "data_words":"F",
    "data_senses":"G"
  }
});
$(document).ready(function(){
  $("#char-form").on('submit',function(e){
    e.preventDefault();
    var code = $(this).find('[name="search"]').val();
    model.where("data_char",code).send(function(response){
      if (response.response_code == 1)
      {
        alert("Not found!");
        return false;
      }
      else {
        form_result($(".char-result"),response.response_data);
      }
    });
  });
  $("#search-by-pron").on('submit',function(e){
    e.preventDefault();
    var code = $(this).find('[name="search"]').val();
    model.like("data_pron",code).send(function(response){
      if (response.response_code == 1)
      {
        alert("Not found!");
        return false;
      }
      else {
        form_result($(".pron-result"),response.response_data);
      }
    });
  });
  $('.logo').on('click',function(e){
    e.preventDefault();
    $('html, body').animate({
            scrollTop: 0
        }, 500);
  });
  $('.nav-menu-item > a').on('click',function(e){
    e.preventDefault();
    var target = $(this).attr("href");
    $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 500);
  });
  $('.search-trigger > li').on('click',function(e){
    var target = $(this).attr("data-tab");
    $(".search-trigger > li.active").removeClass("active");
    $(".search-box").removeClass("active");
    $(this).addClass("active");
    $(target).addClass("active");
  });
  if ($(window).scrollTop() > 200)
  {
    $('header').addClass("small");
  }

  $(window).on('scroll',function(e){
  	if ($(window).scrollTop() > 200)
  	{
  		$('header').addClass("small");
  	}
  	else
  	{
  		$('header').removeClass("small");
  	}
  });
});
