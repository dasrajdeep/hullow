define(['socketio', 'modernizr', 'peerjs', 'headtrackr'], function(io) {
	
	var peer = null;
    var me = null;
    var socket = null;
    var video = null;
    var ongoingCall = null;
    
    var onCallEnd = null;
    
    var rosterMap = {};
    
    var videoConstraints = {
		video: {
			mandatory: {
				maxWidth: 300,
				maxHeight: 300
			}
		},
		audio: false
    };
    
    var init = function(roster_add, roster_remove) {
    	
    	socket = io.connect('http://' + window.location.host + ':85');
        
    	socket.on('connect', function() {
    		socket.emit('register', me);
    	});
    	
        socket.on('roster', function(roster) {
        	for(var entry in roster) {
        		if(entry == me.id) continue;
        		rosterMap[entry] = roster[entry];
        		roster_add(roster[entry], entry);
        	}
        });
        
        socket.on('join', function(user) {
        	if(user.id == me.id) return;
        	rosterMap[user.id] = user.name;
        	roster_add(user['name'], user['id']);
        });
        
        socket.on('leave', function(userID) {
        	delete rosterMap[userID];
        	roster_remove(userID);
        });
    };
    
    var endcall = function() {
    	if(ongoingCall === null) return;
    	ongoingCall.call.close();
    	ongoingCall.stream.stop();
    	video.mozSrcObject=null;
    	video.pause();
    	video.src="";
    	onCallEnd();
    };
    
    var bind_events = function(on_incoming) {
    	
        peer.on('connection', function(con) {
            con.on('data', function(data) {
                console.log(data);
                // TODO chat implementation
            });
        });
        
    	peer.on('call', function(call) {
    		var caller = {username:rosterMap[call.peer], id:call.peer};
    		on_incoming(caller, function() {
    			// on accept
    			var getUserMedia = Modernizr.prefixed('getUserMedia', navigator);
        		getUserMedia(videoConstraints, function(stream) {
        			call.answer(stream);
            		call.on('stream', function(remoteStream) {
            	        video.src = window.URL.createObjectURL(remoteStream);
            	        video.onloadedmetadata = function(event) {
            	        	console.log(event);
            	        	video.play();
            	        };
            	        remoteStream.onended = function() {
            	        	endcall();
            	        };
            		});
            		call.on('close', function() {
            			endcall();
            		});
            		ongoingCall = {call:call, stream:stream};
            	}, function(err) {
            		console.log(err);
            	});
    		});
    	});
    };
    
    /**
     * ===========================================================================
     * 								USER ACCESSIBLE
     * ===========================================================================
     */
    
    /**
     * Stages of login:
     * 1. registers on P2P broker.
     * 2. loads home view via callback.
     * 3. connects to roster management server.
     */
    var login = function(username, roster_add, roster_remove, callback) {
    	
    	peer = new Peer({host: window.location.host, port: 9000, path: '/'});
    	
    	peer.on('open', function(id) {
    		console.log('ID: ' + id);
    		me = {username:username, id:id};
    		callback(function(videoContainer, on_incoming, on_call_end) {
    			video = videoContainer;
    			onCallEnd = on_call_end;
    			bind_events(on_incoming);
    			init(roster_add, roster_remove);
    		});
    	});
    };
    
    var call = function(to) {
    	
    	var getUserMedia = Modernizr.prefixed('getUserMedia', navigator);
    	
    	getUserMedia(videoConstraints, function(stream) {
    		
    		var call = peer.call(to, stream);
    		call.on('stream', function(remoteStream) {
    	        video.src = window.URL.createObjectURL(remoteStream);
    	        video.onloadedmetadata = function(event) {
    	        	console.log(event);
    	        	video.play();
    	        };
    	        remoteStream.onended = function() {
    	        	endcall();
    	        };
    		});
    		call.on('close', function() {
    			endcall();
    		});
    		ongoingCall = {call:call, stream:stream};
    	}, function(err) {
    		console.log(err);
    	});
    };
    
    var text = function(to, msg) {
    	
    	var con = peer.connect(to);
        con.on('open', function() {
            con.send(msg);
        });
    };
    
    return {
    	login: login,
    	call: call,
    	end: endcall,
    	text: text
    };
});