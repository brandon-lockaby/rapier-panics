
import RAPIER from './rapier3d-compat/rapier.es.js';

RAPIER.init().then(() => {

    let world;
    let tickInterval;
    let handleToObjectIdMap = {};
    let objectIdToHandleMap = {};

    let message_handlers = {
        world: args => {
            world = new RAPIER.World(args.gravity);
            postMessage({type: 'world'});
        },
        
        start: args => {
            clearInterval(tickInterval);
            tickInterval = setInterval(() => {
                world.step();
                let active = [];
                world.forEachActiveRigidBody(body => {
                    active.push([handleToObjectIdMap[body.handle], body.translation(), body.rotation()]);
                });
                if(active.length) {
                    postMessage({type: 'active', args: active});
                }
            }, 16);
        },

        stop: () => {
            clearInterval(tickInterval);
        },

        dynamicBodyWithConvexHullColliders: args => {
            let rigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.newDynamic());
            rigidBody.setTranslation(args.translation);
            rigidBody.setRotation(args.rotation);
            for(let i = 0; i < args.colliders.length; i++) {
                let info = args.colliders[i];
                let collider = world.createCollider(RAPIER.ColliderDesc.convexHull(info.vertices), rigidBody.handle);
                collider.setTranslationWrtParent(info.translationWrtParent);
                collider.setRotationWrtParent(info.rotationWrtParent);
            }
            handleToObjectIdMap[rigidBody.handle] = args.objectId;
            objectIdToHandleMap[args.objectId] = rigidBody.handle;
            postMessage({type: 'rigidBody', args: {objectId: args.objectId, mass: rigidBody.mass()}});
        },

        staticBodyWithCuboidColliders: args => {

        },

        setAngvel: args => {
            world.getRigidBody(objectIdToHandleMap[args.objectId]).setAngvel(args.angvel, true);
        },

        applyImpulse: args => {
            world.getRigidBody(objectIdToHandleMap[args.objectId]).applyImpulse(args.impulse, true);
        }
    };

    onmessage = function(message) {
        message_handlers[message.data.type](message.data.args);
    }

    postMessage({type: 'init'});

});
