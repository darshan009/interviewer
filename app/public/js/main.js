//team member
$(document).ready(function(){
  $("#team").click(function(){
    $.dataTeam = $(this).attr("data-team-id");
    $.get( "/partial/team/"+$.dataTeam, function( data ) {
      $('#contents').html(data);
    });
  });
});
//adding team member
$(document).ready(function(){
  $("#addMember").click(function(){
    $.dataTeam = $(this).attr("data-team-id");
    $.get( "/partial/team/"+$.dataTeam+"addMember", function( data ) {
      $('#contents').html(data);
    });
  });
});

//questions
$(document).ready(function(){
  $("#questions").click(function(){
    $.dataQuestions = $(this).attr("data-questions-id");
    $.get( "/partial/questions/"+$.dataQuestions, function( data ) {
      $('#contents').html(data);
    });
  });
});
//add questions
$(document).ready(function(){
  $("#addQuestions").click(function(){
    $.get( "/partial/questions/addQuestions", function( data ) {
      $('#contents').html(data);
    });
  });
});
//all candidates
$(document).ready(function(){
  $("#candidates").click(function(){
    $.dataCandidates = $(this).attr("data-candidates-id");
    $.get( "/partial/candidates/"+$.dataCandidates, function( data ) {
      $('#contents').html(data);
    });
  });
});
//tests completed
$(document).ready(function(){
  $("#completed").click(function(){
    $.get( "/partial/completed", function( data ) {
      $('#contents').html(data);
    });
  });
});
//accepted
$(document).ready(function(){
  $("#accepted").click(function(){
    $.get( "/partial/accepted", function( data ) {
      $('#contents').html(data);
    });
  });
});
