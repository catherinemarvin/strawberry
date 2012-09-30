// Game setup

$("#start").click(function () {
	document.getElementById("game").webkitRequestPointerLock();
});

document.addEventListener("webkitpointerlockchange", function () {
		$("#start").slideToggle();
		if (document.webkitPointerLockElement === document.getElementById("game")) {
			document.addEventListener("mousemove", moveCallback, false);
			document.addEventListener("keypress", keypressCallback, false);
			document.addEventListener("mousedown", mouseclickCallback, false);
		}
		else {
			document.removeEventListener("mousemove", moveCallback, false);
			document.removeEventListener("keypress", keypressCallback, false);
			document.removeEventListener("mousedown", mouseclickCallback, false);
		}
}, false);

$(document).keypress(function (e) {
	var code = e.keyCode;
	if (code === 119) {
		console.log("jump");
		avatar.translateY(10);
	}
	else if (code === 97) {
		console.log("left");
		avatar.translateX(-10);
	}
	else if (code === 100) {
		console.log("right");
		avatar.translateX(10);
	}
});

var moveCallback = function (e) {
	var movementX = e.webkitMovementX || 0;
	var movementY = e.webkitMovementY || 0;
	camera.rotation.x -= movementY / 100;
	camera.rotation.y -= movementX / 100;
};

var keypressCallback = function (e) {
	var code = e.keyCode;
	if (code === 119) {
		camera.translateZ(-50);
	}
	else if (code === 97) {
		camera.translateX(-50);
	}
	else if (code === 115) {
		camera.translateZ(50);
	}
	else if (code === 100) {
		camera.translateX(50);
	}
	else if (code === 32) {
		camera.translateY(50);
	}
	else if (code === 99) {
		camera.translateY(-50);
	}
};

var mouseclickCallback = function (e) {
	//var vector = new THREE.Vector3(0, -2, 0.5);
	// var vector = new THREE.Vector3(( (window.innerWidth/2) / window.innerWidth) * 2 - 1, - ((window/innerHeight/2) / window.innerHeight)*2 + 1, 0.5);
	// projector.unprojectVector(vector, camera);

	// var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
	// var intersects = ray.intersectObjects(visualizerBars);

	// if (intersects.length > 0) {
	// 	console.log("BAMBAMBAM");
	// 	intersects[0].object.material.color.setHex(Math.random()*0xffffff);

	// }



	for (var i = 0; i < numBars; i++) {
		visualizerBars[i].material.color = new THREE.Color(0xFFFFFF*Math.random());		
	}

		// var vector = new THREE.Vector3(( event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight)*2 + 1, 0.5);

		// projector.unprojectVector(vector, camera);

		// var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
		// var intersects = ray.intersectObjects(visualizerBars);

		// if (intersects.length > 0) {
		// 	console.log("PEW PEW");
		// }


};

$(document).click(function (e) {
	var currentScore = parseInt($("#score").text());
	var pointsEarned = Math.floor(Math.random() * 20);
	if (Math.random() > 0.5) {
		pointsEarned *= -1;
	}
	$("#score").text(currentScore+=pointsEarned);

	var vector = new THREE.Vector3(( event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight)*2 + 1, 0.5);

	projector.unprojectVector(vector, camera);

	var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());
	var intersects = ray.intersectObjects(visualizerBars);

	if (intersects.length > 0) {
		console.log("PEW PEW");
		intersects[0].object.material.color.setHex(Math.random()*0xffffff);

	}

});


// ThreeJS prettiness
var camera, scene, renderer;
var clock;
var projector;
var controls;
var avatar;

var init = function () {

	clock = new THREE.Clock();
	projector = new THREE.Projector();
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0005);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1200;
	camera.position.y = 1200;
	camera.position.x = 1500;

	scene.add(camera);

	setupScene();

	renderer = new THREE.WebGLRenderer();
	renderer.shadowMapEnabled = true;
	renderer.domElement.id = "game";
	renderer.domElement.style.backgroundColor = "#D6F1FF";
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

};

var animate = function () {
	requestAnimationFrame(animate);
	render();
};

var render = function () {
	renderer.render(scene,camera);
};

var numBars = 20;
var boxSize = 100;
var visualizerBars = [];
var pointLight;
var ambientLight;
var directionalLight;
var floor;

var setupScene = function () {
	var geometry = new THREE.CubeGeometry(boxSize,boxSize,boxSize);
	for (var i=0; i<numBars; i++) {
		var material = new THREE.MeshPhongMaterial({ color: new THREE.Color(0xFFFFFF*Math.random())});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x += boxSize * i;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);
		visualizerBars.push(mesh);
	}

	avatar = new THREE.Mesh(new THREE.CubeGeometry(25,25,25),new THREE.MeshPhongMaterial({ color: 0x000000 }));
	avatar.position.x = -100;
	avatar.position.y = 1250;
	scene.add(avatar);

	// var startingPlatform = new THREE.Mesh(new THREE.CubeGeometry(200,1200,200), new THREE.MeshPhongMaterial({ color: new THREE.Color(0xFFFFFF*Math.random())}));
	// startingPlatform.position.x -=200;
	// scene.add(startingPlatform);

	//pointLight = new THREE.PointLight(0xFFFFFF);

	//pointLight.lookAt(visualizerBars[0].position);
	//scene.add(pointLight);

	ambientLight = new THREE.AmbientLight(0x555555);
	ambientLight.color.setRGB(0.255,0.255,0.255);
	scene.add(ambientLight);

	directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.lookAt(avatar.position);
	directionalLight.position = camera.position;
	directionalLight.castShadow = true;
	//directionalLight.shadowCameraVisible = true;
	scene.add(directionalLight);

	// //floor = new THREE.Mesh(new THREE.CubeGeometry(5000,25,5000), new THREE.MeshPhongMaterial({ color: 0x000000 }));
	// floor.receiveShadow = false;
	// floor.position.y+=100;
	// scene.add(floor);

};

var simulateGravity = function () {

};

init();
animate();
