
$(document).ready(function(){

  //more info pop up code
  var popupEvent = function() {}

  $('#r1_info').hunterPopup({
     width: '200px',
     height: '80px',
     placement:'left',
     title: "Calculation Information",
     content: $('#r1_content'),
     event: popupEvent
  });

  $('#r2_info').hunterPopup({
     width: '320px',
     height: '100px',
     title: "Calculation Information",
     content: $('#r2_content'),
     event: popupEvent
  });

  $('#r3_info').hunterPopup({
     width: '300px',
     height: '80px',
     title: "Calculation Information",
     content: $('#r3_content'),
     event: popupEvent
  });

  $('#r4_info').hunterPopup({
     width: '480px',
     height: '260px',
     placement:'left_px',
     title: "To determine the amount you'll need to save, multiply the amount you need to make up by the factor below:",
     content: $('#r4_content'),
     event: popupEvent
  });

  $('#r5_info').hunterPopup({
     width: '380px',
     height: '100px',
     placement:'left_px',
     title: "Multiply your savings to date by the factor below:",
     content: $('#r5_content'),
     event: popupEvent
  });

  $('#r6_info').hunterPopup({
     width: '350px',
     height: '80px',
     placement:'left_px',
     title: "Calculation Information",
     content: $('#r6_content'),
     event: popupEvent
  });

  $('#r7_info').hunterPopup({
     width: '480px',
     height: '100px',
     placement:'left_px_1',
     title: "To determine the ANNUAL amount you'll need to save, multiply the TOTAL amount by the factor below:",
     content: $('#r7_content'),
     event: popupEvent
  });

  $('#ss_info').hunterPopup({
     width: '450px',
     height: '130px',
     placement:'left',
     title: "Social Security Calculation",
     content: $('#ss_content'),
     event: popupEvent
  });


});  //ready
