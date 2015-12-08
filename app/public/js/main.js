$(document).ready(function(){
  $("#team").click(function(){
    $.get( "/partial/team", function( data ) {
      $('#contents').html(data);
    });
  });
});
$(document).ready(function(){
  $("#questions").click(function(){
    $.get( "/partial/questions", function( data ) {
      $('#contents').html(data);
    });
  });
});
$(document).ready(function(){
  $("#candidates").click(function(){
    $.get( "/partial/candidates", function( data ) {
      $('#contents').html(data);
    });
  });
});
$(document).ready(function(){
  $("#completed").click(function(){
    $.get( "/partial/completed", function( data ) {
      $('#contents').html(data);
    });
  });
});
$(document).ready(function(){
  $("#accepted").click(function(){
    $.get( "/partial/accepted", function( data ) {
      $('#contents').html(data);
    });
  });
});
