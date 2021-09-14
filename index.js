import * as THREE from './lib/three.module.js';
import { GLTFLoader } from './lib/GLTFLoader.js';



const spawn_zone_size = 1000;
const num_objects = 100;

const object_scale = .01;
const physics_scale = .001;

const test_force = .5;



const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
const scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0xffeebb, 0x202040, 1));
let camera = new THREE.PerspectiveCamera();
camera.far = spawn_zone_size * 10;
FWCamera.implement(camera, scene);
camera.fw.zoomout = spawn_zone_size;
camera.fw.update();

function render(time) {
    requestAnimationFrame(render);

    let canvas = renderer.domElement;
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    if(width != canvas.width || height != canvas.height) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    
    renderer.render(scene, camera);
}
requestAnimationFrame(render);


        
let message_handlers = {
    active: active => {
        for(let i = 0; i < active.length; i++) {
            let info = active[i];
            let node = scene.getObjectById(info[0]);
            node.position.copy(info[1]).divideScalar(physics_scale);
            node.setRotationFromQuaternion(info[2]);
        }
    },

    rigidBody: body => {
        // impulse toward center
        let node = scene.getObjectById(body.objectId);
        let force = test_force * body.mass * physics_scale;
        let impulse = new THREE.Vector3().copy(node.position).negate().multiplyScalar(force);
        rapierWorker.postMessage({type: 'applyImpulse', args: {objectId: node.id, impulse}});
    },
    
    init: () => {
        rapierWorker.postMessage({type: 'world', args: {gravity: {x: 0, y: 0, z: 0}}});
    },

    world: () => {
        rapierWorker.postMessage({type: 'start'});

        fetch('./objects.json').then(response => response.json()).then(list => {
            for(let i = 0; i < num_objects; i++) {
                let name = list[Math.floor(Math.random() * list.length)];
                loadObject(name).then(node => {
                    node.position.set(Math.random()*spawn_zone_size - spawn_zone_size/2, Math.random()*spawn_zone_size - spawn_zone_size/2, Math.random()*spawn_zone_size - spawn_zone_size/2);
                    node.rotateZ(Math.PI);
                    node.scale.set(object_scale, object_scale, object_scale);

                    addObjectPhysics(node);

                    let angvel = Math.random() * 0.1 + 0.1;
                    angvel = new THREE.Vector3(Math.random() * 0.1 + 0.05, Math.random() * 0.1 + 0.05, Math.random() * 0.1 + 0.05);
                    angvel.applyEuler(new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2));
                    rapierWorker.postMessage({type: 'setAngvel', args: {objectId: node.id, angvel}});

                    scene.add(node);
                    console.log(`Added ${name}`);

                }).catch(reason => {
                    console.warn(`Failed to load '${name}':`, reason);
                });
            }
        });

        // click things for info
        const mouse = new THREE.Vector2();
        const raycaster = new THREE.Raycaster();
        document.addEventListener('click', click => {
            if(click.altKey || click.ctrlKey || click.shiftKey) return;
            mouse.x = (click.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(click.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            let intersects = raycaster.intersectObject(scene, true);
            if(!intersects.length) return;
            let node = intersects[0].object.parent;
            console.log(`${node.userData.name} (${node.children.length} hull)`); 
        });
    }
};

let rapierWorker = new Worker("./lib/rapierWorker.js", {type: "module"});

rapierWorker.onmessage = function(message) {
    message_handlers[message.data.type](message.data.args);
}





function loadObject(name, load_vhacd = false) {
    return new Promise((resolve, reject) => {
        new GLTFLoader().load(`./objects/${name.replace('#','%23')}`, gltf => {
            const node = gltf.scene;
            node.userData.name = name;
            node.traverse(child => {
                if(child instanceof THREE.Mesh) {
                    child.geometry.computeVertexNormals();
                    let old_mat = child.material;
                    child.material = new THREE.MeshLambertMaterial({color: new THREE.Color(Math.random()/2+0.25, Math.random()/2+0.25, Math.random()/2+0.25)});
                    old_mat.dispose();
                }
            });
            resolve(node);
        }, undefined, error => reject(error));
    });
}



function addObjectPhysics(node) {
    let message = {type: 'dynamicBodyWithConvexHullColliders', args: {
        objectId: node.id,
        translation: new THREE.Vector3().copy(node.position).multiplyScalar(physics_scale),
        rotation: {x: node.quaternion.x, y: node.quaternion.y, z: node.quaternion.z, w: node.quaternion.w},
        colliders: []
    }};
    if(node.children.length < 1) throw("No children to make colliders", node);
    for(let ci = 0; ci < node.children.length; ci++) {
        let child = node.children[ci];
        if(!(child instanceof THREE.Mesh)) return;
        let vertices = child.geometry.attributes.position.array.slice();
        for(let i = 0; i < vertices.length; i += 3) {
            vertices[i] *= node.scale.x * physics_scale;
            vertices[i+1] *= node.scale.y * physics_scale;
            vertices[i+2] *= node.scale.z * physics_scale;
        }
        message.args.colliders.push({
            translationWrtParent: new THREE.Vector3().copy(child.position).multiply(node.scale).multiplyScalar(physics_scale),
            rotationWrtParent: {x: child.quaternion.x, y: child.quaternion.y, z: child.quaternion.z, w: child.quaternion.w},
            vertices
        });
    }
    rapierWorker.postMessage(message);
}