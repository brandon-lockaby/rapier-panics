import * as THREE from './three.module.js';

class FWCamera{
	static implement(camera, scene) {
		camera.fw = {
			raycaster: new THREE.Raycaster(),
			zoomout: 10,
		    spin1: .001,
		    spin2: Math.PI / 4.0,
		    lastmx: 0,
		    lastmy: 0,
		    minzoom: 0.9,
		    maxzoom: 10000,
		    point: new THREE.Vector3(0, 0, 0)
		}
		const fw = camera.fw;
		
		var handleMouseMove = function(event) {
			var mx = event.clientX  / window.innerWidth - 0.5;
			var my = event.clientY / window.innerHeight - 0.5;
			var xDiff = mx - fw.lastmx;
			var yDiff = my - fw.lastmy;
			if(event.shiftKey === true) {
				var vec = new THREE.Vector3(-xDiff * fw.zoomout, yDiff * fw.zoomout, 0);
				vec.applyQuaternion(camera.quaternion);
				camera.position.add(vec);
				fw.point.add(vec);
				update();
			}
			else if(event.ctrlKey === true) {
				fw.spin2 += -yDiff * 5;
				fw.spin1 += xDiff * 5;
				update();
			}
			else if(event.altKey === true) {
				fw.zoomout += yDiff * 50;
				fw.spin1 += xDiff * 20;
				update();
			}
			fw.lastmx = mx;
			fw.lastmy = my;
			return;
		};
		
		var handleMouseDown = function(event) {
			if(event.altKey === true) {
				event.preventDefault();
				var vector = new THREE.Vector2(( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1);
				fw.raycaster.setFromCamera(vector, camera);
				var intersects = fw.raycaster.intersectObject(scene, true);
				if(intersects.length > 0) {
					fw.point = intersects[0].point;
					var vec = new THREE.Vector3().copy(camera.position).sub(fw.point);
					fw.zoomout = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z) || fw.minzoom;
					update();
					// todo: fix spin1 and spin2
				}
				if(event.ctrlKey == true) {
					fw.zoomout = fw.minzoom;
					update();
				}
				return true;
			}
			return false;
		};
		
		var handleMouseWheel = function(event) {
			event.preventDefault();
			fw.zoomout += (event.detail ? event.detail : -event.wheelDeltaY / 30);
			fw.spin1 += (event.detail ? event.detail : -event.wheelDeltaX / 400);
			update();
		};
		
		var update = function() {
			if(fw.zoomout > fw.maxzoom) fw.zoomout = fw.maxzoom;
			else if(fw.zoomout < fw.minzoom) fw.zoomout = fw.minzoom;
			if(fw.spin2 > Math.PI) fw.spin2 = Math.PI;
			else if(fw.spin2 <= 0) fw.spin2 = 0.001;
		
			var vec = new THREE.Vector3();
			vec.y = Math.cos(fw.spin2) * fw.zoomout;
			vec.z = Math.sin(fw.spin2) * fw.zoomout;
			var dist2 = vec.z;
			vec.x = Math.cos(fw.spin1) * dist2;
			vec.z = Math.sin(fw.spin1) * dist2;
			camera.position.copy(vec.add(fw.point));
			camera.lookAt(fw.point);
		}
		
		document.addEventListener('mousemove', handleMouseMove, false);
		document.addEventListener('mousedown', handleMouseDown, false);
		document.addEventListener('wheel', handleMouseWheel, {passive: false});
		update();
		camera.fw.update = update;
		return camera;
	}
};

if(window) window.FWCamera = FWCamera;
export { FWCamera }

