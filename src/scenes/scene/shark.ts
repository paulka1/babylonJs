import { Mesh } from "@babylonjs/core";

/**
 * This represents a script that is attached to a node in the editor.
 * Available nodes are:
 *      - Meshes
 *      - Lights
 *      - Cameas
 *      - Transform nodes
 * 
 * You can extend the desired class according to the node type.
 * Example:
 *      export default class MyMesh extends Mesh {
 *          public onUpdate(): void {
 *              this.rotation.y += 0.04;
 *          }
 *      }
 * The function "onInitialize" is called immediately after the constructor is called.
 * The functions "onStart" and "onUpdate" are called automatically.
 */
export default class MyScript extends Mesh {
    aller: boolean = true;

    /**
     * Override constructor.
     * @warn do not fill.
     */
    // @ts-ignore ignoring the super call as we don't want to re-init
    private constructor() { }

    /**
     * Called on the node is being initialized.
     * This function is called immediatly after the constructor has been called.
     */
    public onInitialize(): void {
        
    }

    /**
     * Called on the scene starts.
     */
    public onStart(): void {
        // document.addEventListener("keydown",(ev)=>{
        //     if(ev.key === "j"){
        //         this.position.z += 1;
        //     }
        // })
        this.position.x = -30;
        this.position.y = -37;
        this.position.z = -93;
    }

    /**
     * Called each frame.
     */
    public onUpdate(): void {
        
            if(this.position.z < 97){
                this.position.z += 1
            }
            if(this.position.z > 60 && this.position.y > -100){
                this.position.y -= 0.5
            }
            else {
                this.aller = false;
                
            }
        
        // if(!this.way){
        //     this.position.z = 100
        //     this.position.y = -100
        //     if(this.position.z > -100){
        //         this.position.z -= 1
        //     }
        //     if(this.position.z > 0 && this.position.y > -100){
        //         this.position.y -= 0.5
        //     }
        //     else {
        //         this.way = true;
        //     }
        // }
        // }
    }

    /**
     * Called on a message has been received and sent from a graph.
     * @param message defines the name of the message sent from the graph.
     * @param data defines the data sent in the message.
     * @param sender defines the reference to the graph class that sent the message.
     */
    public onMessage(name: string, data: any, sender: any): void {
        switch (name) {
            case "myMessage":
                // Do something...
                break;
        }
    }
}
