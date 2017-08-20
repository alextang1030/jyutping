$(document).ready(function(){
  $("#char-form").on('submit',function(e){
    e.preventDefault();
    var code = $(this).find('[name="search"]').val();
    jyutPing.searchForPron(code,function(response){
      if (response.response_code == 1)
      {
        alert("Not found!");
        return false;
      }
      else {
        $(".char-result").empty();
        $.each(response.response_data,function(i,v){
          $(".char-result").append(
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
    });
  });
  $("#search-by-pron").on('submit',function(e){
    e.preventDefault();
    var code = $(this).find('[name="search"]').val();
    jyutPing.searchForChar(code,function(response){
      if (response.response_code == 1)
      {
        alert("Not found!");
        return false;
      }
      else {
        $(".pron-result").empty();
        $.each(response.response_data,function(i,v){
          $(".pron-result").append(
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
