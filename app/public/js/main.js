
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
  //post page for adding member
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
    $.testId = $(this).attr("data-test-question");
    $.get( "/partial/questions/"+$.testId+"/addQuestions", function( data ) {
      $('#contents').html(data);
    });
  });
  //post adding questions
  $("#addNewQuestion").submit(function(){
    var testLinkQuestion = $("#questionList").attr("data-test-addQuestion");
    var newQuestion = $("#questionList").val();
    var questions = {
      question: $("#questionList").val(),
      correct: $("#correctOne").val()
    };
    questions.opts =[];
    questions.opts.push($("#optionsList1").val());
    questions.opts.push($("#optionsList2").val());
    questions.opts.push($("#optionsList3").val());
    $.post( "/partial/questions/"+testLinkQuestion+"/addQuestions", {data: JSON.stringify(questions)})
    .done(function( data ) {
        $('#contents').html(data);
      });
     event.preventDefault();
  });

//invite candidates
  $("#invites").click(function(){
    $.inviteId = $(this).attr("data-invites-id");
    $.get( "/partial/candidates/"+$.inviteId+"/invites", function( data ) {
      $('#contents').html(data);
    });
  });
  $("#invitesForm").submit(function(){
    var fromInvites = $("#invitesEmail").attr("data-from-invites");
    var newInviteEmail = $("#invitesEmail").val();
    $.post( "/partial/candidates/"+fromInvites+"/invites",{email: newInviteEmail})
    .done(function( data ) {
        $('#contents').html(data);
      });
     event.preventDefault();
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
