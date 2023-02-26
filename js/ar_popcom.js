/** Object to define popup form to send comments (php mail function) for AppReg experiment

Define the object popcom with methods :
--- init(id_elm)
		initialize the popup div that holds the form and the click event on the id_elm id 
 		that will make the div appears
--- send_msg(comm, mail)
		send the comments with php mail function by calling the db/popcom_send.php scripts
		with an Ajax requests
		display a message is sending was ok or not (if not, the user will have the possibility 
		to coppy its comment text in his clipboard)

* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2017-03-23 christelle.zielinski@blri.fr
*/

var popcom = (function(){
	var core = {};
	
	/**
	 Define the popup div 
	 **/
	core.init = function(id_elm){
			// Popup div container with display property set to 'none' 
			// (not visible until id_elm is clicked)
			var $popout = $('<div/>')
				.attr('id', 'popcom_outer')
				.css('display', 'none');
			// Cross for closing the div	
			var $closediv = $('<div/>')
				.attr('id', 'popcom_closediv')
				.html('<a id="popcom_cross" class="close"></a>');
						
			$popout.append($closediv);			
			
			// Popum form div
			var $popinn = $('<div/>')
				.attr('id', 'popcom_inner');	
			// Preamble
			var $hdr = $('<div/>')
				.attr('id', 'popcom_hdr')
				.html("<p>Pour toutes questions ou remarques, vous pouvez nous envoyer un message.</p><p>Si vous désirez une réponse, merci de renseigner votre adresse mail.</p>");
			
			// Label for comment input text
			var $comm = $('<span/>')
					.addClass('pop_label')
					.html('Votre message : ');
			// Input text area
			var $inp_com = $('<textarea/>')
					.addClass('pop_input')
					.attr('id', 'popcom_comm')
					.focus();
			// Label for mail input text field		
			var $mail = $('<span/>')
					.addClass('pop_label')
					.html('Votre mail (optionnel) : ');
			// Mail input text field		
			var $inp_mail = $('<input/>')
					.addClass('pop_input')
					.attr('id', 'popcom_mail');	

			// Submit button
			var $subm = $('<div />')
				.attr('id',"popcom_submit")
				.addClass("pop_but");

			var $but = $('<a />')
				.attr("id","submit")			
				.html("<span id='subbut_txt'>Envoyer</span>");
						
			$subm.append($but);
			
			// Add all form elements to the form div
			$popinn.append($hdr, $comm, $inp_com, $mail, $inp_mail, $subm);
			// Add form div to the popup div container
			$popout.append($popinn);

			// Add the popup to the body
			$('body').append($popout);
			
			// Fire click events
			// Display the comments div when click on it
			var selink = '#'+id_elm;
			
			$(selink).click(function(){	
				// Display the popcom div
				$("#popcom_outer").fadeIn(400);
				// Add click event on the close cross to close the div
				$("#popcom_cross").click(function(){
					$('#popcom_resp').remove();
					$('#popcom_inner').show();
					// Remove text in input fields
					$('#popcom_comm').val('');
					$('#popcom_mail').val('');
					$("#popcom_outer").fadeOut(10);
				});	
				// Add click event to the submit button to send the data (send_msg method)
				function submit_press(e){						
					// Disable click event on the Submit button to prevent multiple ajax requests
					// http://stackoverflow.com/questions/18775455/ajax-prevent-multiple-request-on-click
					// Remove submit default action
					e.preventDefault();
					// Remove click handler
					$(this).off('click');
					
					// Get text in input field
					var comm = $('#popcom_comm').val();
					var mail = $('#popcom_mail').val();
					
					// Send comments only if not empty
					if (comm.length > 0){
						// Remove the line returns
						comm = comm.replace(/(\r\n|\n|\r)/gm," ");
						core.send_msg(comm, mail);
					}else{
						$(this).on('click', submit_press);
					}
				}
				$('#popcom_submit').click(submit_press);
			});
		};
	
	/** Send the form content (comments comm and mail)
		Display specific message if success or error
	**/
	core.send_msg = function (comm, mail){
		
		// Message to display if sending is a success
		function send_ok(){
			// Text to display
			var $resp = $('<div/>')
				.attr('id', 'popcom_resp')
				.addClass('popcom_success')
				.html('Message envoyé !');
			// Hide inner form content
			$('#popcom_inner').hide();
			// Display success text
			$('#popcom_closediv').append($resp);
		}
	
		// Message to display if problem was encountered to send the message
		function send_error(subjcomm){
			// Text to display
			var $resp = $('<div/>')
				.attr('id', 'popcom_resp')
				.addClass('popcom_error')
				.html("<p>Un problème est survenu lors de l'envoi du message.</p><p>Vous pouvez nous envoyer vos commentaires à l'adresse : <span class='black'>arnaud.rey@univ-amu.fr</span></p>");
			
			// Copy the initial message to allow to copy it in the Clipboard
			var $rlab = $('<span/>')
					.addClass('pop_label')
					.html('Votre message : ');

			var $resc = $('<textarea/>')
					.addClass('pop_input pop_resc')
					.attr('id', 'popresc_txt')
					.val(subjcomm)
					.focus();			
			
			// Add button to copy text (clipboard) 								
			var $copybut = $('<div />')
				.attr('id',"popcom_copy")
				.addClass("pop_but")
				.click(function(){
					$('#popresc_txt').focus().select();
					document.execCommand('copy');
					$('#popresc_txt').off("select");
					var $okcopy = $('<p/>')
					.attr('id', 'okcopy')
					.addClass('green')
					.html('Copié !');
					
					$('#popcom_resp').append($okcopy);
					$('#okcopy').fadeOut(1200, function(){
						$('#okcopy').remove();
					});
				});

			var $cbut = $('<a />')			
				.html("<span id='pop_coptxt'>Copier le message dans le presse-papier</span>");
			
			$copybut.append($cbut);
			$resp.append($rlab, $resc, $copybut);
			// Hide inner form content
			$('#popcom_inner').hide();
			// Display error message and copy button
			$('#popcom_closediv').append($resp);			
		}
		
		// The ajax request to send message by popcom_send.php script
		$.ajax({
			type:"GET",
			cache: false,
			url:"db/popcom_send.php",
			data: {
				comment: comm, 
				mail: mail},
			success: function(){
				send_ok();
		
				if(window.console) console.log("Message sent");
			},
			error: function(){
				send_error(comm);
			}
		});
	};	
	
	return core;
})();
	