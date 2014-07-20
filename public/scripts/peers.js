define(['../scripts/caller', 'bootstrap', 'draggable'], function(caller) {
    
	var call_in_progress = false;
	var call_party = null;
	
    load_css('/styles/peer');
    
    $(document).ready(function() {
    	bind_event_handlers();
    });
    
    function bind_event_handlers() {
    	$('#btn-user').click(function() {
    		
        	var username = $('#username').val();
            var valid = /^[a-zA-Z0-9]+$/.test(username);
            
            if(!valid) {
            	$('#username').popover({
            		placement: 'right',
            		trigger: 'manual',
            		content: 'A username can only contain letters (A-Z/a-z) and numbers (0-9).'
            	}).popover('show');
            	return;
            }
            
            caller.login(username, roster_add, roster_remove, load_home);
        });
    }
    
    function load_home(callback) {
    	load_view('home', $('body').get(0), function() {
        	
    		$('#sidebar,#pad').css({
    			'height':window.innerHeight
    		});
    		
    		$('#vid').drags();
    		
    		$('#pic').click(function() {
    			console.log('snapshot');
    			snapshot();
    		});
    		
    		var video = document.querySelector('video');
    		
    		callback(video, 
			function(caller, accept_call) {
    			roster_call($('#user_' + caller.id), caller.id);
    			$('#caller').text(caller.username);
    			$('#answer').click(function() {
        			accept_call();
            		$('#incoming').modal('hide');
        		});
        		$('#reject').click(function() {
        			$('#incoming').modal('hide').modal('destroy');
        		});
        		$('#incoming').modal('show');
    		}, function() {
    			call_in_progress = false;
    			$('#user_' + call_party)
    				.removeClass('list-group-item-danger')
    				.addClass('list-group-item-success')
    				.find('.call-icon')
    				.removeClass('glyphicon-phone-alt')
    				.addClass('glyphicon-facetime-video');
    	    	call_party = null;
    		});
    	});
    }
    
    function roster_add(entry, id) {
    	var item = $('<a>')
			.addClass('list-group-item list-group-item-success')
			.attr({'href':'#', 'id':'user_'+id})
			.append($('<span>').addClass('username').text(entry))
			.append($('<span>').addClass('call-icon glyphicon glyphicon-facetime-video pull-right'))
		.appendTo('.list-group');
    	item.click(function() {
    		if(call_in_progress) {
    			if(call_party == id) {
    				// end call
    				caller.end();
    			}
    			return;
    		}
    		roster_call($(this), id);
			caller.call(id);
		});
    }
    
    function roster_call(item, party) {
    	call_in_progress = true;
    	call_party = party;
    	item
			.removeClass('list-group-item-success')
			.addClass('list-group-item-danger')
			.find('.call-icon')
			.removeClass('glyphicon-facetime-video')
			.addClass('glyphicon-phone-alt');
    }
    
    function roster_remove(entry) {
    	var id = '#user_' + entry;
    	$(id).remove();
    }
    
    function snapshot() {
    	var video = document.querySelector('video');
    	var canvas = document.querySelector('canvas');
    	var context = canvas.getContext('2d');
    	context.drawImage(video, 0, 0, canvas.width, canvas.height);
    	var img_data = canvas.toDataURL('image/png');
    	$('<div>')
    		.addClass('col-md-4 collage')
    		.append($('<img>').attr({'width':'100%', 'src':img_data}))
    		.appendTo('#pad');
    }
});
