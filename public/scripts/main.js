requirejs.config({
	baseUrl: 'vendor/',
    paths: {
    	draggable: '../scripts/draggable',
        jquery: 'jquery/dist/jquery.min',
        bootstrap : 'bootstrap/dist/js/bootstrap.min',
        ace: 'ace-builds/src-min-noconflict/ace',
        threejs: 'threejs/build/three.min',
        jstorage: 'jstorage/jstorage.min',
        json2: 'json2/json2',
        modernizr: 'modernizr/modernizr',
        socketio: 'socket.io/socket.io',
        socketiostream: 'socket.io/socket.io-stream',
        peerjs: 'peerjs/peer.min',
        headtrackr: 'headtrackr/headtrackr.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'jstorage': {
            deps: ['json2', 'jquery']
        },
        'draggable': {
        	deps: ['jquery']
        }
    }
});

load_css('vendor/bootstrap/dist/css/bootstrap.min');

if(controller !== undefined) {
    require(['../scripts/' + controller]);
}

function load_css(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url + '.css';
    document.getElementsByTagName("head")[0].appendChild(link);
}

function load_view(view, element, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/view/' + view, true);
	xhr.send();
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			var response = xhr.responseText;
			element.innerHTML = response;
			callback();
		}
	};
}