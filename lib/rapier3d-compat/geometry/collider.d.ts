import { RawColliderSet } from "../raw";
import { Rotation, Vector } from '../math';
import { CoefficientCombineRule, RigidBodyHandle } from '../dynamics';
import { ActiveHooks, ActiveEvents } from "../pipeline";
import { InteractionGroups } from './interaction_groups';
import { Shape, ShapeType } from './shape';
export declare enum ActiveCollisionTypes {
    DYNAMIC_DYNAMIC = 1,
    DYNAMIC_KINEMATIC = 12,
    DYNAMIC_STATIC = 2,
    KINEMATIC_KINEMATIC = 52224,
    KINEMATIC_STATIC = 8704,
    STATIC_STATIC = 32,
    DEFAULT = 15,
    ALL = 60943
}
/**
 * The integer identifier of a collider added to a `ColliderSet`.
 */
export declare type ColliderHandle = number;
/**
 * A geometric entity that can be attached to a body so it can be affected
 * by contacts and proximity queries.
 */
export declare class Collider {
    private rawSet;
    readonly handle: ColliderHandle;
    constructor(rawSet: RawColliderSet, handle: ColliderHandle);
    /**
     * Checks if this collider is still valid (i.e. that it has
     * not been deleted from the collider set yet.
     */
    isValid(): boolean;
    /**
     * The world-space translation of this rigid-body.
     */
    translation(): Vector;
    /**
     * The world-space orientation of this rigid-body.
     */
    rotation(): Rotation;
    /**
     * Is this collider a sensor?
     */
    isSensor(): boolean;
    setSensor(isSensor: boolean): void;
    setShape(shape: Shape): void;
    /**
     * Sets the restitution coefficient of the collider to be created.
     *
     * @param restitution - The restitution coefficient in `[0, 1]`. A value of 0 (the default) means no bouncing behavior
     *                   while 1 means perfect bouncing (though energy may still be lost due to numerical errors of the
     *                   constraints solver).
     */
    setRestitution(restitution: number): void;
    /**
     * Sets the friction coefficient of the collider to be created.
     *
     * @param friction - The friction coefficient. Must be greater or equal to 0. This is generally smaller than 1. The
     *                   higher the coefficient, the stronger friction forces will be for contacts with the collider
     *                   being built.
     */
    setFriction(friction: number): void;
    /**
     * Gets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     */
    frictionCombineRule(): CoefficientCombineRule;
    /**
     * Sets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule ??? The combine rule to apply.
     */
    setFrictionCombineRule(rule: CoefficientCombineRule): void;
    /**
     * Gets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     */
    restitutionCombineRule(): CoefficientCombineRule;
    /**
     * Sets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule ??? The combine rule to apply.
     */
    setRestitutionCombineRule(rule: CoefficientCombineRule): void;
    /**
     * Sets the collision groups used by this collider.
     *
     * Two colliders will interact iff. their collision groups are compatible.
     * See the documentation of `InteractionGroups` for details on teh used bit pattern.
     *
     * @param groups - The collision groups used for the collider being built.
     */
    setCollisionGroups(groups: InteractionGroups): void;
    /**
     * Sets the solver groups used by this collider.
     *
     * Forces between two colliders in contact will be computed iff their solver
     * groups are compatible.
     * See the documentation of `InteractionGroups` for details on the used bit pattern.
     *
     * @param groups - The solver groups used for the collider being built.
     */
    setSolverGroups(groups: InteractionGroups): void;
    /**
     * Get the physics hooks active for this collider.
     */
    activeHooks(): void;
    /**
     * Set the physics hooks active for this collider.
     *
     * Use this to enable custom filtering rules for contact/intersecstion pairs involving this collider.
     *
     * @param activeHooks - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveHooks(activeHooks: ActiveHooks): void;
    /**
     * The events active for this collider.
     */
    activeEvents(): ActiveEvents;
    /**
     * Set the events active for this collider.
     *
     * Use this to enable contact and/or intersection event reporting for this collider.
     *
     * @param activeEvents - The events active for contact/intersection pairs involving this collider.
     */
    setActiveEvents(activeEvents: ActiveEvents): void;
    /**
     * Gets the collision types active for this collider.
     */
    activeCollisionTypes(): ActiveCollisionTypes;
    /**
     * Set the collision types active for this collider.
     *
     * @param activeCollisionTypes - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveCollisionTypes(activeCollisionTypes: ActiveCollisionTypes): void;
    /**
     * Sets the translation of this collider.
     *
     * @param tra - The world-space position of the collider.
     */
    setTranslation(tra: Vector): void;
    /**
     * Sets the translation of this collider relative to its parent rigid-body.
     *
     * Does nothing if this collider isn't attached to a rigid-body.
     *
     * @param tra - The new translation of the collider relative to its parent.
     */
    setTranslationWrtParent(tra: Vector): void;
    /**
     * Sets the rotation quaternion of this collider.
     *
     * This does nothing if a zero quaternion is provided.
     *
     * @param rotation - The rotation to set.
     */
    setRotation(rot: Rotation): void;
    /**
     * Sets the rotation quaternion of this collider relative to its parent rigid-body.
     *
     * This does nothing if a zero quaternion is provided or if this collider isn't
     * attached to a rigid-body.
     *
     * @param rotation - The rotation to set.
     */
    setRotationWrtParent(rot: Rotation): void;
    /**
     * The type of the shape of this collider.
     */
    shapeType(): ShapeType;
    /**
     * The half-extents of this collider if it is a cuboid shape.
     */
    halfExtents(): Vector;
    /**
     * The radius of this collider if it is a ball, cylinder, capsule, or cone shape.
     */
    radius(): number;
    /**
     * The radius of the round edges of this collider if it is a round cylinder.
     */
    roundRadius(): number;
    /**
     * The half height of this collider if it is a cylinder, capsule, or cone shape.
     */
    halfHeight(): number;
    /**
     * If this collider has a triangle mesh, polyline, convex polygon, or convex polyhedron shape,
     * this returns the vertex buffer of said shape.
     */
    vertices(): Float32Array;
    /**
     * If this collider has a triangle mesh, polyline, or convex polyhedron shape,
     * this returns the index buffer of said shape.
     */
    indices(): Uint32Array;
    /**
     * If this collider has a heightfield shape, this returns the heights buffer of
     * the heightfield.
     * In 3D, the returned height matrix is provided in column-major order.
     */
    heightfieldHeights(): Float32Array;
    /**
     * If this collider has a heightfield shape, this returns the scale
     * applied to it.
     */
    heightfieldScale(): Vector;
    /**
     * If this collider has a heightfield shape, this returns the number of
     * rows of its height matrix.
     */
    heightfieldNRows(): number;
    /**
     * If this collider has a heightfield shape, this returns the number of
     * columns of its height matrix.
     */
    heightfieldNCols(): number;
    /**
     * The unique integer identifier of the rigid-body this collider is attached to.
     */
    parent(): RigidBodyHandle;
    /**
     * The friction coefficient of this collider.
     */
    friction(): number;
    /**
     * The density of this collider.
     */
    density(): number;
    /**
     * The collision groups of this collider.
     */
    collisionGroups(): InteractionGroups;
    /**
     * The solver groups of this collider.
     */
    solverGroups(): InteractionGroups;
}
export declare class ColliderDesc {
    shape: Shape;
    useMassProps: boolean;
    mass: number;
    centerOfMass: Vector;
    principalAngularInertia: Vector;
    angularInertiaLocalFrame: Rotation;
    density: number;
    friction: number;
    restitution: number;
    rotation: Rotation;
    translation: Vector;
    isSensor: boolean;
    collisionGroups: InteractionGroups;
    solverGroups: InteractionGroups;
    frictionCombineRule: CoefficientCombineRule;
    restitutionCombineRule: CoefficientCombineRule;
    activeEvents: ActiveEvents;
    activeHooks: ActiveHooks;
    activeCollisionTypes: ActiveCollisionTypes;
    /**
     * Initializes a collider descriptor from the collision shape.
     *
     * @param shape - The shape of the collider being built.
     */
    constructor(shape: Shape);
    /**
     * Create a new collider descriptor with a ball shape.
     *
     * @param radius - The radius of the ball.
     */
    static ball(radius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a capsule shape.
     *
     * @param halfHeight - The half-height of the capsule, along the `y` axis.
     * @param radius - The radius of the capsule basis.
     */
    static capsule(halfHeight: number, radius: number): ColliderDesc;
    /**
     * Creates a new segment shape.
     *
     * @param a - The first point of the segment.
     * @param b - The second point of the segment.
     */
    static segment(a: Vector, b: Vector): ColliderDesc;
    /**
     * Creates a new triangle shape.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     */
    static triangle(a: Vector, b: Vector, c: Vector): ColliderDesc;
    /**
     * Creates a new triangle shape with round corners.
     *
     * @param a - The first point of the triangle.
     * @param b - The second point of the triangle.
     * @param c - The third point of the triangle.
     * @param borderRadius - The radius of the borders of this triangle. In 3D,
     *   this is also equal to half the thickness of the triangle.
     */
    static roundTriangle(a: Vector, b: Vector, c: Vector, borderRadius: number): ColliderDesc;
    /**
     * Creates a new collider descriptor with a polyline shape.
     *
     * @param vertices - The coordinates of the polyline's vertices.
     * @param indices - The indices of the polyline's segments. If this is `null`,
     *    the vertices are assumed to describe a line strip.
     */
    static polyline(vertices: Float32Array, indices: Uint32Array): ColliderDesc;
    /**
     * Creates a new collider descriptor with a triangle mesh shape.
     *
     * @param vertices - The coordinates of the triangle mesh's vertices.
     * @param indices - The indices of the triangle mesh's triangles.
     */
    static trimesh(vertices: Float32Array, indices: Uint32Array): ColliderDesc;
    /**
     * Creates a new collider descriptor with a cuboid shape.
     *
     * @param hx - The half-width of the rectangle along its local `x` axis.
     * @param hy - The half-width of the rectangle along its local `y` axis.
     * @param hz - The half-width of the rectangle along its local `z` axis.
     */
    static cuboid(hx: number, hy: number, hz: number): ColliderDesc;
    /**
     * Creates a new collider descriptor with a rectangular shape with round borders.
     *
     * @param hx - The half-width of the rectangle along its local `x` axis.
     * @param hy - The half-width of the rectangle along its local `y` axis.
     * @param hz - The half-width of the rectangle along its local `z` axis.
     * @param borderRadius - The radius of the cuboid's borders.
     */
    static roundCuboid(hx: number, hy: number, hz: number, borderRadius: number): ColliderDesc;
    /**
     * Creates a new collider descriptor with a heightfield shape.
     *
     * @param nrows ??? The number of rows in the heights matrix.
     * @param ncols - The number of columns in the heights matrix.
     * @param heights - The heights of the heightfield along its local `y` axis,
     *                  provided as a matrix stored in column-major order.
     * @param scale - The scale factor applied to the heightfield.
     */
    static heightfield(nrows: number, ncols: number, heights: Float32Array, scale: Vector): ColliderDesc;
    /**
     * Create a new collider descriptor with a cylinder shape.
     *
     * @param halfHeight - The half-height of the cylinder, along the `y` axis.
     * @param radius - The radius of the cylinder basis.
     */
    static cylinder(halfHeight: number, radius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a cylinder shape with rounded corners.
     *
     * @param halfHeight - The half-height of the cylinder, along the `y` axis.
     * @param radius - The radius of the cylinder basis.
     * @param borderRadius - The radius of the cylinder's rounded edges and vertices.
     */
    static roundCylinder(halfHeight: number, radius: number, borderRadius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a cone shape.
     *
     * @param halfHeight - The half-height of the cone, along the `y` axis.
     * @param radius - The radius of the cone basis.
     */
    static cone(halfHeight: number, radius: number): ColliderDesc;
    /**
     * Create a new collider descriptor with a cone shape with rounded corners.
     *
     * @param halfHeight - The half-height of the cone, along the `y` axis.
     * @param radius - The radius of the cone basis.
     * @param borderRadius - The radius of the cone's rounded edges and vertices.
     */
    static roundCone(halfHeight: number, radius: number, borderRadius: number): ColliderDesc;
    /**
     * Computes the convex-hull of the given points and use the resulting
     * convex polyhedron as the shape for this new collider descriptor.
     *
     * @param points - The point that will be used to compute the convex-hull.
     */
    static convexHull(points: Float32Array): ColliderDesc | null;
    /**
     * Creates a new collider descriptor that uses the given set of points assumed
     * to form a convex polyline (no convex-hull computation will be done).
     *
     * @param vertices - The vertices of the convex polyline.
     */
    static convexMesh(vertices: Float32Array, indices: Uint32Array): ColliderDesc | null;
    /**
     * Computes the convex-hull of the given points and use the resulting
     * convex polyhedron as the shape for this new collider descriptor. A
     * border is added to that convex polyhedron to give it round corners.
     *
     * @param points - The point that will be used to compute the convex-hull.
     * @param borderRadius - The radius of the round border added to the convex polyhedron.
     */
    static roundConvexHull(points: Float32Array, borderRadius: number): ColliderDesc | null;
    /**
     * Creates a new collider descriptor that uses the given set of points assumed
     * to form a round convex polyline (no convex-hull computation will be done).
     *
     * @param vertices - The vertices of the convex polyline.
     * @param borderRadius - The radius of the round border added to the convex polyline.
     */
    static roundConvexMesh(vertices: Float32Array, indices: Uint32Array, borderRadius: number): ColliderDesc | null;
    /**
     * Sets the position of the collider to be created relative to the rigid-body it is attached to.
     */
    setTranslation(x: number, y: number, z: number): ColliderDesc;
    /**
     * Sets the rotation of the collider to be created relative to the rigid-body it is attached to.
     *
     * @param rot - The rotation of the collider to be created relative to the rigid-body it is attached to.
     */
    setRotation(rot: Rotation): ColliderDesc;
    /**
     * Sets whether or not the collider being created is a sensor.
     *
     * A sensor collider does not take part of the physics simulation, but generates
     * proximity events.
     *
     * @param is - Set to `true` of the collider built is to be a sensor.
     */
    setSensor(is: boolean): ColliderDesc;
    /**
     * Sets the density of the collider being built.
     *
     * @param density - The density to set, must be greater or equal to 0. A density of 0 means that this collider
     *                  will not affect the mass or angular inertia of the rigid-body it is attached to.
     */
    setDensity(density: number): ColliderDesc;
    /**
     * Sets the mass properties of the collider being built.
     *
     * This replaces the mass-properties automatically computed from the collider's density and shape.
     * These mass-properties will be added to the mass-properties of the rigid-body this collider will be attached to.
     *
     * @param mass ??? The mass of the collider to create.
     * @param centerOfMass ??? The center-of-mass of the collider to create.
     * @param principalAngularInertia ??? The initial principal angular inertia of the collider to create.
     *                                  These are the eigenvalues of the angular inertia matrix.
     * @param angularInertiaLocalFrame ??? The initial local angular inertia frame of the collider to create.
     *                                   These are the eigenvectors of the angular inertia matrix.
     */
    setMassProperties(mass: number, centerOfMass: Vector, principalAngularInertia: Vector, angularInertiaLocalFrame: Rotation): ColliderDesc;
    /**
     * Sets the restitution coefficient of the collider to be created.
     *
     * @param restitution - The restitution coefficient in `[0, 1]`. A value of 0 (the default) means no bouncing behavior
     *                   while 1 means perfect bouncing (though energy may still be lost due to numerical errors of the
     *                   constraints solver).
     */
    setRestitution(restitution: number): ColliderDesc;
    /**
     * Sets the friction coefficient of the collider to be created.
     *
     * @param friction - The friction coefficient. Must be greater or equal to 0. This is generally smaller than 1. The
     *                   higher the coefficient, the stronger friction forces will be for contacts with the collider
     *                   being built.
     */
    setFriction(friction: number): ColliderDesc;
    /**
     * Sets the rule used to combine the friction coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule ??? The combine rule to apply.
     */
    setFrictionCombineRule(rule: CoefficientCombineRule): ColliderDesc;
    /**
     * Sets the rule used to combine the restitution coefficients of two colliders
     * colliders involved in a contact.
     *
     * @param rule ??? The combine rule to apply.
     */
    setRestitutionCombineRule(rule: CoefficientCombineRule): ColliderDesc;
    /**
     * Sets the collision groups used by this collider.
     *
     * Two colliders will interact iff. their collision groups are compatible.
     * See the documentation of `InteractionGroups` for details on teh used bit pattern.
     *
     * @param groups - The collision groups used for the collider being built.
     */
    setCollisionGroups(groups: InteractionGroups): ColliderDesc;
    /**
     * Sets the solver groups used by this collider.
     *
     * Forces between two colliders in contact will be computed iff their solver
     * groups are compatible.
     * See the documentation of `InteractionGroups` for details on the used bit pattern.
     *
     * @param groups - The solver groups used for the collider being built.
     */
    setSolverGroups(groups: InteractionGroups): ColliderDesc;
    /**
     * Set the physics hooks active for this collider.
     *
     * Use this to enable custom filtering rules for contact/intersecstion pairs involving this collider.
     *
     * @param activeHooks - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveHooks(activeHooks: ActiveHooks): ColliderDesc;
    /**
     * Set the events active for this collider.
     *
     * Use this to enable contact and/or intersection event reporting for this collider.
     *
     * @param activeEvents - The events active for contact/intersection pairs involving this collider.
     */
    setActiveEvents(activeEvents: ActiveEvents): ColliderDesc;
    /**
     * Set the collision types active for this collider.
     *
     * @param activeCollisionTypes - The hooks active for contact/intersection pairs involving this collider.
     */
    setActiveCollisionTypes(activeCollisionTypes: ActiveCollisionTypes): ColliderDesc;
}
