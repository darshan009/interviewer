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

//getting selected answers
$("#btnSubmit").click(function(){
  var result = $('input[type="checkbox"]:checked');
    if(result.length>0){
      var resultString = [];
      result.each(function(){
        resultString.push($(this).val());
      });
    }else{
      alert("you have not selected any answers");
    }
    console.log(resultString);
  $.post( "/partial/"+$("#answeredCheckbox").attr("data-test-answer")+"/"+$("#answeredCheckbox").attr("data-candidate-answer")+"/giveTest",{resultString: resultString})
  .done(function( data ) {
    });
});

//all candidates
$("#allCandidates").click(function(){
  var dataAllCandidates = $(this).attr("data-allCandidates-id");
  console.log("all candidates main.js");
  $.get( "/partial/displayAllCandidates/"+dataAllCandidates, function( data ) {
    $('#contents').html(data);
  });
});

//tests completed
$("#completed").click(function(){
  var dataCompleted = $(this).attr("data-completed-id");
  $.get( "/partial/completed/"+dataCompleted, function( data ) {
    $('#contents').html(data);
  });
});
//accept the candidates, loop through each button to check the clicked one
$('.acceptButton').each(function () {
    var $this = $(this);
    var accepted = [];
    var dataPostCompleted = $(this).attr("data-accept-btn");
    $this.on("click", function () {
        accepted = $(this).data('accept');
        $.post( "/partial/completed/"+dataPostCompleted, {accepted: accepted})
        .done(function( data ) {
          $('#contents').html(data);
        });
    });
});
$('.rejectButton').each(function () {
    var $this = $(this);
    var rejected = [];
    var dataPostCompletedReject = $(this).attr("data-reject-btn");
    $this.on("click", function () {
        rejected = $(this).data('reject');
        $.post( "/partial/completed/"+dataPostCompletedReject, {rejected: rejected})
        .done(function( data ) {
          $('#contents').html(data);
        });
    });
});

//accepted
  $("#accepted").click(function(){
    var dataAccepted = $(this).attr("data-accepted-id");
    $.get( "/partial/accepted/"+dataAccepted, function( data ) {
      $('#contents').html(data);
    });
  });

});
