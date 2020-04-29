
//jQuery time

$(document).ready(function(){

$("#error_td").hide();

fillAge(); // fill in age dropdown list


$(".reset").click(function(){

  $(this).closest("fieldset").find('input:text').val('');
	$(this).closest("fieldset").find('select').prop('selectedIndex',0);
	$("#user_title").html("you");

});

$('#user_current_salary').on('change',function(e){
    //alert('Changed!')
		var s = $('#user_current_salary').val();
		var k = 0;
		if(s<25000) {
			k = 8000;
		} else if(s>=25000 && s<=40000) {
			k = 12000;
		} else {
			k = 14500;
		}
		$('#ss_income').val(k);
});

// print function
$('#print_button').click(function(e){
		e.preventDefault();

		var flag = $("#calc_flag").val();
		if(flag == "0") {
			return false;
		}

		fillSummary();
		var w = window.open();
		var print_html = $('#content_for_print').html();
		w.document.write('<html><head><title>Retirement Saving Plan</title></head><body>' + print_html + '</body></html>');
		w.window.print();
		w.document.close();
		return false;
});


});  //ready

var dialog;
dialog = $( "#dialog-form" ).dialog({
      autoOpen: false,
      minHeight: 400,
      minWidth: 600,
      modal: true,
      buttons: {
				OK: function() {

					$('#retiremnt_age').val($('#pop_retiremnt_age').val());
					$('#exp_age_death').val($('#pop_exp_age_death').val());
					$('#pc_current_salary').val($('#pop_pc_current_salary').val());
					$('#savings_to_date').val($('#pop_savings_to_date').val());

					calculateAmounts();

          dialog.dialog( "close" );

        },
        CANCEL: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {

      }
    });
$( "#whatif_button" ).button().on( "click", function() {
	   var flag = $("#calc_flag").val();
		 if(flag == "0") {
			 return false;
		 }
   //add values
	  $('#pop_retiremnt_age').val($('#retiremnt_age').val());
		$('#pop_exp_age_death').val($('#exp_age_death').val());
		$('#pop_pc_current_salary').val($('#pc_current_salary').val());
		$('#pop_savings_to_date').val($('#savings_to_date').val());

      dialog.dialog( "open" );

    });

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function fillAge() {
	let dropdown = $('#user_age');
	dropdown.empty();
	dropdown.append('<option selected="true" disabled>Select here</option>');
	dropdown.prop('selectedIndex', 0);

	for (var i = 20; i < 50; i++) {
    dropdown.append($('<option></option>').attr('value', i).text(i));
	}

}

function fillLEData(val) {

	//alert(val)

	 var leObj = {};
	 let dropdown = $('#exp_age_death, #pop_exp_age_death');
   dropdown.empty();
	 dropdown.append('<option selected="true" disabled>Choose here</option>');
   dropdown.prop('selectedIndex', 0);

	 leObj['F'] = [{"value":"86","label":"Age 86"}, {"value":"92","label":"Age 92"}, {"value":"97","label":"Age 97"}];
	 leObj['M'] = [{"value":"82","label":"Age 82"}, {"value":"89","label":"Age 89"}, {"value":"94","label":"Age 94"}];
   var data = leObj[val];
	 $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.value).text(entry.label));
  })

}


function parseValue(val) {
	if(val.length){
		return parseFloat(val);
	} else { return 0; }
}

function calculateAmounts(){
  //debugger
	var k = validateForm();
	if(!k) {
		$("#error_td").show();
		return false;
	}

	// var fn = $("#first_name").val();
	// var ln = $("#last_name").val();
  // $("#user_title").html(fn + " " + ln);

	var age = parseInt($("#user_age").val());
	var user_current_salary = parseFloat($("#user_current_salary").val());
	var pc_current_salary = parseFloat($("#pc_current_salary").val());

	var retiremnt_age = parseInt($("#retiremnt_age").val());
	var exp_age_death = parseInt($("#exp_age_death").val());
	var savings_to_date = parseFloat($("#savings_to_date").val());
	var ss_income = parseValue($("#ss_income").val());
	var tep_income = parseValue($("#tep_income").val());
	var part_income = parseValue($("#part_income").val());
	var other_income = parseValue($("#other_income").val());

	var ret_income = parseFloat(user_current_salary*(pc_current_salary/100));
	var exp_income = parseFloat(ss_income + tep_income + part_income + other_income);
	var net_income = ret_income-exp_income;

  var matrixObj = {};
	matrixObj["55"] = {"82":"18.79","86":"20.53","89":"21.71","92":"22.79","94":"23.46","97":"24.40"};
	matrixObj["60"] = {"82":"16.31","86":"18.32","89":"19.68","92":"20.93","94":"21.71","97":"22.79"};
	matrixObj["65"] = {"82":"13.45","86":"15.77","89":"17.35","92":"18.79","94":"19.68","97":"20.93"};
	matrixObj["70"] = {"82":"10.15","86":"12.83","89":"14.65","92":"16.31","94":"17.35","97":"18.79"};

	var innerObj = matrixObj[retiremnt_age];
	var factor = innerObj[exp_age_death];

	var factor_income = parseFloat(factor)*net_income;

	//if retirement happens before 65 yrs
	var factObj = {"55":"8.8", "60":"4.7", "65":"0", "70":"0"};
	var ss_factor = factObj[retiremnt_age];
	var f_ss_income = parseFloat(ss_income)*parseFloat(ss_factor);

  factor_income = factor_income + f_ss_income; //if retires before 65 yrs

	var retire_in_years = retiremnt_age-age;

	var svFactObj = {"10":"1.3","15":"1.6","20":"1.8","25":"2.1","30":"2.4","35":"2.8","40":"3.3"};
	var svFactObj_keys = Object.keys(svFactObj);
	var indx = 0;
	$.each(svFactObj_keys, function( index, value ) {
		  if(retire_in_years-value >= 0) {
				indx = value;
			}
	});

	var sv_factor = svFactObj[indx];

	var factored_savings_to_date = parseFloat(sv_factor)*savings_to_date;
	var net_facotred_amt = factor_income-factored_savings_to_date;

	var annFactObj = {"10":".085","15":".052","20":".036","25":".027","30":".020","35":".016","40":".013"};
	var annFactObj_keys = Object.keys(annFactObj);

	var indxx = 0;
	$.each(annFactObj_keys, function( index, value ) {
		  if(retire_in_years-value >= 0) {
				indxx = value;
			}
	});
	var ann_factor = annFactObj[indxx];

	var final_income = parseFloat(ann_factor)*net_facotred_amt;


	//set values
	$("#ann_income").val(ret_income.toFixed(2));
	$("#ot_income").val(exp_income.toFixed(2));
	$("#amt_makeup_per_year").val(net_income.toFixed(2));
	$("#amt_need_to_save").val(factor_income.toFixed(2));
	$("#savings_to_date_m").val(factored_savings_to_date.toFixed(2));

	$("#additional_savings").val(net_facotred_amt.toFixed(2));
	$("#annual_savings").val(final_income.toFixed(2));

	$("#result_td").css("opacity",1);
  //$('#whatif_button').removeAttr('disabled');
	$("#td_print_button").show();
	$("#calc_flag").val("1");


}

function validateForm(){

	//var first_name = $('#first_name').val();
	var gender = $('#gender').val();
	var user_age = $('#user_age').val();
	var retiremnt_age = $('#retiremnt_age').val();
	var exp_age_death = $('#exp_age_death').val();
	var user_current_salary = $('#user_current_salary').val();
	var pc_current_salary = $('#pc_current_salary').val();
	var savings_to_date = $('#savings_to_date').val();

	if(gender.length==0 || user_age==null || retiremnt_age==null || exp_age_death==null || user_current_salary.length==0 || pc_current_salary.length==0 || savings_to_date.length==0)  {
		return false;
	} else {
		return true;
	}

}

function calculateAmountsForProfessional(){
  debugger
	var k = validateFormForProfessional();
	if(!k) {
		$("#error_td").show();
		return false;
	}

	var fn = $("#first_name").val();
	var ln = $("#last_name").val();
  $("#user_title").html(fn + " " + ln);

	var age = parseInt($("#user_age").val());
	var user_current_salary = parseFloat($("#user_current_salary").val());
	var pc_current_salary = parseFloat($("#pc_current_salary").val());

	var retiremnt_age = parseInt($("#retiremnt_age").val());
	var exp_age_death = parseInt($("#exp_age_death").val());
	var savings_to_date = parseFloat($("#savings_to_date").val());
	var ss_income = parseValue($("#ss_income").val());
	var tep_income = parseValue($("#tep_income").val());
	var part_income = parseValue($("#part_income").val());
	var other_income = parseValue($("#other_income").val());

	var ret_income = parseFloat(user_current_salary*(pc_current_salary/100));
	var exp_income = parseFloat(ss_income + tep_income + part_income + other_income);
	var net_income = ret_income-exp_income;

  var matrixObj = {};
	matrixObj["55"] = {"82":"18.79","86":"20.53","89":"21.71","92":"22.79","94":"23.46","97":"24.40"};
	matrixObj["60"] = {"82":"16.31","86":"18.32","89":"19.68","92":"20.93","94":"21.71","97":"22.79"};
	matrixObj["65"] = {"82":"13.45","86":"15.77","89":"17.35","92":"18.79","94":"19.68","97":"20.93"};
	matrixObj["70"] = {"82":"10.15","86":"12.83","89":"14.65","92":"16.31","94":"17.35","97":"18.79"};

	var innerObj = matrixObj[retiremnt_age];
	var factor = innerObj[exp_age_death];

	var factor_income = parseFloat(factor)*net_income;

	//if retirement happens before 65 yrs
	var factObj = {"55":"8.8", "60":"4.7", "65":"0", "70":"0"};
	var ss_factor = factObj[retiremnt_age];
	var f_ss_income = parseFloat(ss_income)*parseFloat(ss_factor);

  factor_income = factor_income + f_ss_income; //if retires before 65 yrs

	var retire_in_years = retiremnt_age-age;

	var svFactObj = {"10":"1.3","15":"1.6","20":"1.8","25":"2.1","30":"2.4","35":"2.8","40":"3.3"};
	var svFactObj_keys = Object.keys(svFactObj);
	var indx = 0;
	$.each(svFactObj_keys, function( index, value ) {
		  if(retire_in_years-value >= 0) {
				indx = value;
			}
	});

	var sv_factor = svFactObj[indx];

	var factored_savings_to_date = parseFloat(sv_factor)*savings_to_date;
	var net_facotred_amt = factor_income-factored_savings_to_date;

	var annFactObj = {"10":".085","15":".052","20":".036","25":".027","30":".020","35":".016","40":".013"};
	var annFactObj_keys = Object.keys(annFactObj);

	var indxx = 0;
	$.each(annFactObj_keys, function( index, value ) {
		  if(retire_in_years-value >= 0) {
				indxx = value;
			}
	});
	var ann_factor = annFactObj[indxx];

	var final_income = parseFloat(ann_factor)*net_facotred_amt;


	//set values
	$("#ann_income").val(ret_income.toFixed(2));
	$("#ot_income").val(exp_income.toFixed(2));
	$("#amt_makeup_per_year").val(net_income.toFixed(2));
	$("#amt_need_to_save").val(factor_income.toFixed(2));
	$("#savings_to_date_m").val(factored_savings_to_date.toFixed(2));
	$("#additional_savings").val(net_facotred_amt.toFixed(2));
	$("#annual_savings").val(final_income.toFixed(2));

	$("#result_td").css("opacity",1);
  //$('#whatif_button').removeAttr('disabled');
	$("#td_print_button").show();
	$("#calc_flag").val("1");


}


function validateFormForProfessional(){

	var first_name = $('#first_name').val();
	var gender = $('#gender').val();
	var user_age = $('#user_age').val();
	var retiremnt_age = $('#retiremnt_age').val();
	var exp_age_death = $('#exp_age_death').val();
	var user_current_salary = $('#user_current_salary').val();
	var pc_current_salary = $('#pc_current_salary').val();
	var savings_to_date = $('#savings_to_date').val();

	if(first_name.length==0 || gender.length==0 || user_age==null || retiremnt_age==null || exp_age_death==null || user_current_salary.length==0 || pc_current_salary.length==0 || savings_to_date.length==0)  {
		return false;
	} else {
		return true;
	}

}


function fillSummary(){
debugger
  if($("#first_name").length){
  	var first_name = $('#first_name').val();
  	var last_name = $('#last_name').val() ;
  }
	var gender = $('#gender').val();
	gender = (gender=="M")?"Male":"Female";
	var user_age = $('#user_age').val();
	var retiremnt_age = $('#retiremnt_age').val();
	var exp_age_death = $('#exp_age_death').val();
	var user_current_salary = $('#user_current_salary').val();
	var pc_current_salary = $('#pc_current_salary').val();
	var savings_to_date = $('#savings_to_date').val();

	var ss_income = $("#ss_income").val();
	var tep_income = $("#tep_income").val();
	var part_income = $("#part_income").val();
	var other_income = $("#other_income").val();

	var ann_income = $("#ann_income").val();
	var ot_income = $("#ot_income").val();
	var amt_makeup_per_year = $("#amt_makeup_per_year").val();
	var amt_need_to_save = $("#amt_need_to_save").val();
	var savings_to_date_m = $("#savings_to_date_m").val();
	var additional_savings = $("#additional_savings").val();
	var annual_savings = $("#annual_savings").val();

  if($("#first_name").length){
	$('#rps_first_name').html(first_name);
	$('#rps_last_name').html(last_name);
  }

	$('#rps_gender').html(gender);
	$('#rps_user_age').html(user_age + ' Yrs');
	$('#rps_retiremnt_age').html(retiremnt_age + ' Yrs');
	$('#rps_exp_age_death').html(exp_age_death + ' Yrs');
	$('#rps_user_current_salary').html('$ ' + user_current_salary);
	$('#rps_pc_current_salary').html(pc_current_salary + '%');
	$('#rps_ss_income').html('$' + ss_income);
	$('#rps_tep_income').html('$' + tep_income);
	$('#rps_part_income').html('$' + part_income);
	$('#rps_other_income').html('$' + other_income);
	$('#rps_savings_to_date').html('$' + savings_to_date);

	$('#rps_ann_income').html('$' + ann_income);
	$('#rps_ot_income').html('$' + ot_income);
	$('#rps_amt_makeup_per_year').html('$' + amt_makeup_per_year);
	$('#rps_amt_need_to_save').html('$' + amt_need_to_save);
	$('#rps_savings_to_date_m').html('$' + savings_to_date_m);
	$('#rps_additional_savings').html('$' + additional_savings);
	$('#rps_annual_savings').html('$' + annual_savings);



}
