
$(document).ready(function(){
  //team member
  $("#team").click(function(){
    $.dataTeam = $(this).attr("data-team-id");
    $.get( "/partial/team/"+$.dataTeam, function( data ) {
      $('#contents').html(data);
    });
  });
//adding team member
  $("#addMember").click(function(){
    $.testFromTeam = $(this).attr("test-from-team");
    $.get( "/partial/team/"+$.testFromTeam+"/addMember", function( data ) {
      $('#contents').html(data);
    });
  });
  $("#addTeamMember").submit(function(){
    var testLinkTeam = $("#teamEmail").attr("data-team-id");
    var memberEmail = $("#teamEmail").val();
    $.post( "/partial/team/"+testLinkTeam+"/addMember", {email: memberEmail})
      .done(function( data ) {
        $('#contents').html(data);
      });
     event.preventDefault();
  });

//questions
  $("#questions").click(function(){
    $.dataQuestions = $(this).attr("data-questions-id");
    $.get( "/partial/questions/"+$.dataQuestions, function( data ) {
      $('#contents').html(data);
    });
  });
//add questions
  $("#addQuestions").click(function(){
    $.testId = $(this).attr("test-data");
    $.get( "/partial/questions/"+$.testId+"/addQuestions", function( data ) {
      $('#contents').html(data);
    });
  });

//all candidates
  $("#candidates").click(function(){
    $.dataCandidates = $(this).attr("data-candidates-id");
    $.get( "/partial/candidates/"+$.dataCandidates, function( data ) {
      $('#contents').html(data);
    });
  });

//tests completed
  $("#completed").click(function(){
    $.get( "/partial/completed", function( data ) {
      $('#contents').html(data);
    });
  });

//accepted
  $("#accepted").click(function(){
    $.get( "/partial/accepted", function( data ) {
      $('#contents').html(data);
    });
  });

});
