// Game setup
$("#start").click(function () {
	document.getElementById("game").webkitRequestPointerLock();
});

document.addEventListener("webkitpointerlockchange", function () {
		if (document.webkitPointerLockElement === document.getElementById("game")) {
			document.addEventListener("mousemove", moveCallback, false);
			document.addEventListener("keypress", keypressCallback, false);
		}
		else {
			document.removeEventListener("mousemove", moveCallback, false);
			document.removeEventListener("keypress", keypressCallback, false);
		}
}, false);

var moveCallback = function (e) {
	var movementX = e.webkitMovementX || 0;
	var movementY = e.webkitMovementY || 0;
	camera.rotation.x -= movementY / 100;
	camera.rotation.y -= movementX / 100;
};

var keypressCallback = function (e) {
	var code = e.keyCode;
	console.log(code);
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
}




// ThreeJS prettiness
var camera, scene, renderer;
var clock;
var projector;
var controls;

var init = function () {

	clock = new THREE.Clock();
	projector = new THREE.Projector();
	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2(0xD6F1FF, 0.0005);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1000;
	scene.add(camera);

	setupScene();

	renderer = new THREE.CanvasRenderer();
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
	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	renderer.render(scene,camera);
}

var setupScene = function () {
	var geometry = new THREE.CubeGeometry(200,200,200);
	var material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true});
	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

init();
animate();
