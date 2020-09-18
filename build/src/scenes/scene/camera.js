"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@babylonjs/core");
var tools_1 = require("../tools");
var PlayerCamera = /** @class */ (function (_super) {
    __extends(PlayerCamera, _super);
    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    function PlayerCamera() {
        var _this = this;
        _this.ballTable = [];
        return _this;
    }
    /**
     * Called on the scene starts.
     */
    PlayerCamera.prototype.onStart = function () {
        var _this = this;
        // For the example, let's configure the keys of the camera using the @visibleInInspector decorator.
        this.keysUp = [this._forwardKey];
        this.keysDown = [this._backwardKey];
        this.keysLeft = [this._strafeLeftKey];
        this.keysRight = [this._strafeRightKey];
        document.addEventListener("keydown", function (ev) {
            if (ev.keyCode === 32) {
                _this.position.y += 2;
            }
        });
        this["_needMoveForGravity"] = true;
        this.onCollide = function (m) {
            if (m.metadata) {
                if (m.metadata.isBlock === true) {
                    this.position.z += 4;
                }
                if (m.metadata.isTouched === true) {
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
    };
    /**
     * Called each frame.
     */
    PlayerCamera.prototype.onUpdate = function () {
        for (var i = 0; i < this.ballTable.length; i++) {
            if (this.ballTable[i].intersectsMesh(this._target)) {
                this.position.z -= 10;
            }
        }
    };
    PlayerCamera.prototype.gameOver = function () {
        if (this.position.y < 1) {
            this.getScene().dispose();
            this.getScene().getEngine().stopRenderLoop();
            return true;
        }
        return false;
    };
    /**
     * Called on the user clicks on the canvas.
     * Used to request pointer lock and launch a new ball.
     */
    PlayerCamera.prototype._onPointerEvent = function (info) {
        this._enterPointerLock();
        this._launchBall(info);
    };
    /**
     * Called on the escape key (key code 27) is up.
     * Used to exit pointer lock.
     */
    PlayerCamera.prototype._onEscapeKey = function () {
        var engine = this.getEngine();
        if (engine.isPointerLock) {
            engine.exitPointerlock();
        }
    };
    /**
     * Requests the pointer lock.
     */
    PlayerCamera.prototype._enterPointerLock = function () {
        var engine = this.getEngine();
        if (!engine.isPointerLock) {
            engine.enterPointerlock();
        }
    };
    /**
     * Launches a new ball from the camera position to the camera direction.
     */
    PlayerCamera.prototype._launchBall = function (info) {
        // Create a new ball instance
        var ballInstance = this._ball.createInstance("ballInstance");
        ballInstance.position.copyFrom(this._ball.getAbsolutePosition());
        this.ballTable.push(ballInstance);
        // Create physics impostor for the ball instance
        ballInstance.physicsImpostor = new core_1.PhysicsImpostor(ballInstance, core_1.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0.2, restitution: 0.2 });
        // Apply impulse on ball
        var force = this.getDirection(new core_1.Vector3(0, 0, 1)).multiplyByFloats(this._ballForceFactor, this._ballForceFactor, this._ballForceFactor);
        ballInstance.applyImpulse(force, ballInstance.getAbsolutePosition());
    };
    __decorate([
        tools_1.fromScene("target")
    ], PlayerCamera.prototype, "_target", void 0);
    __decorate([
        tools_1.fromChildren("ball")
    ], PlayerCamera.prototype, "_ball", void 0);
    __decorate([
        tools_1.visibleInInspector("KeyMap", "Forward Key", "z".charCodeAt(0))
    ], PlayerCamera.prototype, "_forwardKey", void 0);
    __decorate([
        tools_1.visibleInInspector("KeyMap", "Backward Key", "s".charCodeAt(0))
    ], PlayerCamera.prototype, "_backwardKey", void 0);
    __decorate([
        tools_1.visibleInInspector("KeyMap", "Strafe Left Key", "q".charCodeAt(0))
    ], PlayerCamera.prototype, "_strafeLeftKey", void 0);
    __decorate([
        tools_1.visibleInInspector("KeyMap", "Strafe Right Key", "d".charCodeAt(0))
    ], PlayerCamera.prototype, "_strafeRightKey", void 0);
    __decorate([
        tools_1.visibleInInspector("number", "Ball Force Factor", 1)
    ], PlayerCamera.prototype, "_ballForceFactor", void 0);
    __decorate([
        tools_1.onPointerEvent(core_1.PointerEventTypes.POINTERDOWN, false)
    ], PlayerCamera.prototype, "_onPointerEvent", null);
    __decorate([
        tools_1.onKeyboardEvent([27], core_1.KeyboardEventTypes.KEYUP)
    ], PlayerCamera.prototype, "_onEscapeKey", null);
    return PlayerCamera;
}(core_1.FreeCamera));
exports.default = PlayerCamera;
//# sourceMappingURL=camera.js.map