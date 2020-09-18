import { FreeCamera, PointerEventTypes, Mesh, PointerInfo, PhysicsImpostor, Vector3, KeyboardEventTypes, Camera, AbstractMesh } from "@babylonjs/core";

import { fromChildren, visibleInInspector, onPointerEvent, onKeyboardEvent, fromScene } from "../tools";

export default class PlayerCamera extends FreeCamera {
    ballTable: AbstractMesh[] = [];

    @fromScene("target")
    private _target: Mesh;

    @fromChildren("ball")
    private _ball: Mesh;

    @visibleInInspector("KeyMap", "Forward Key", "z".charCodeAt(0))
    private _forwardKey: number;

    @visibleInInspector("KeyMap", "Backward Key", "s".charCodeAt(0))
    private _backwardKey: number;

    @visibleInInspector("KeyMap", "Strafe Left Key", "q".charCodeAt(0))
    private _strafeLeftKey: number;

    @visibleInInspector("KeyMap", "Strafe Right Key", "d".charCodeAt(0))
    private _strafeRightKey: number;

    @visibleInInspector("number", "Ball Force Factor", 1)
    private _ballForceFactor: number;

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    private constructor() { }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
        // For the example, let's configure the keys of the camera using the @visibleInInspector decorator.
        this.keysUp = [this._forwardKey];
        this.keysDown = [this._backwardKey];
        this.keysLeft = [this._strafeLeftKey];
        this.keysRight = [this._strafeRightKey];

        document.addEventListener("keydown",(ev)=>{ 
             if(ev.keyCode === 32){
                 this.position.y += 2;
             }
         })

         this["_needMoveForGravity"] = true;
        
         this.onCollide = function (m) {
             if(m.metadata){
                if(m.metadata.isBlock === true){
                    this.position.z += 4;
                }  
                if(m.metadata.isTouched === true){
                    this.position.z += 30;
                }
             }      
         };
        
        // document.addEventListener("keydown",(ev)=>{
        //     if(ev.keyCode === 32){
        // this.getScene().getEngine().getDeltaTime()  
        //     } 
        // }
        // document.addEventListener('keydown',(ev)=>
        // {
        //     if(ev.keyCode === 32)
        //     {
        //         this._i .set(0, 0.25, 0);
        //     }
        // });
        // document.addEventListener("keydown",(ev)=>{
        //     if(ev.keyCode === 32){
        //         this.position.y += 2;
        //         setTimeout(function(){
        //             console.log("iioioioi")
        //             this.position.y -= 2;
        //             this.jump = true;
        //         }, 1000);
        //         console.log("iio111")
        //         if(this.jump){
        //             this.jump = false;
        //         }
        //     }
        // })
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        
        for(let i = 0; i < this.ballTable.length; i ++){
           if(this.ballTable[i].intersectsMesh(this._target)){
               this.position.z -= 10;
           }
        }
    }

    public gameOver(): boolean {
        if(this.position.y < 1){
            this.getScene().dispose();
            this.getScene().getEngine().stopRenderLoop();
            return true;
        }
        return false;
    }

    /**
     * Called on the user clicks on the canvas.
     * Used to request pointer lock and launch a new ball.
     */
    @onPointerEvent(PointerEventTypes.POINTERDOWN, false)
    private _onPointerEvent(info: PointerInfo): void {
        this._enterPointerLock();
        this._launchBall(info);
    }

    /**
     * Called on the escape key (key code 27) is up.
     * Used to exit pointer lock.
     */
    @onKeyboardEvent([27], KeyboardEventTypes.KEYUP)
    private _onEscapeKey(): void {
        const engine = this.getEngine();
        if (engine.isPointerLock) {
            engine.exitPointerlock();
        }
    }

    /**
     * Requests the pointer lock.
     */
    private _enterPointerLock(): void {
        const engine = this.getEngine();
        if (!engine.isPointerLock) {
            engine.enterPointerlock();
        }
    }

    /**
     * Launches a new ball from the camera position to the camera direction.
     */
    private _launchBall(info: PointerInfo): void {
        // Create a new ball instance
        const ballInstance = this._ball.createInstance("ballInstance");
        ballInstance.position.copyFrom(this._ball.getAbsolutePosition());

        this.ballTable.push(ballInstance);
    
        // Create physics impostor for the ball instance
        ballInstance.physicsImpostor = new PhysicsImpostor(ballInstance, PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0.2, restitution: 0.2 });

        // Apply impulse on ball
        const force = this.getDirection(new Vector3(0, 0, 1)).multiplyByFloats(this._ballForceFactor, this._ballForceFactor, this._ballForceFactor);
        ballInstance.applyImpulse(force, ballInstance.getAbsolutePosition());
    }

}
