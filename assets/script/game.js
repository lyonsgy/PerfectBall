cc.Class({
    extends: cc.Component,

    properties: {
        ballNode: cc.Node,
        blockPrefab: cc.Prefab,
        blockAreaNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initPhysics()
        this.initBlock()

        this.node.on('touchstart', this.boost, this)
        this.gameStart = 0
    },

    onDestroy () {
        this.node.off('touchstart', this.boost, this)
    },

    update (dt) {
        if (this.gameStart) {
            let speed = -350 * dt

            for (let blockNode of this.blockNodeArr) {
                blockNode.x += speed

                if (blockNode.x < - cc.winSize.width / 2 - blockNode.width / 2) {
                    blockNode.x = this.getLastBlockPosX() + 200
                }
            }
        }
    },
    getLastBlockPosX () {
        let posX = 0
        for (let blockNode of this.blockNodeArr) {
            if (blockNode.x > posX) {
                posX = blockNode.x
            }
        }
        return posX
    },
    // 初始化跳板
    initBlock () {
        this.lastBlocKPosX = this.ballNode.x  // 最后一个方块的x轴
        this.blockNodeArr = []
        for (let i = 0; i < 10; i++) {
            let blockNode = cc.instantiate(this.blockPrefab)
            blockNode.x = this.lastBlocKPosX
            blockNode.y = 0
            this.blockAreaNode.addChild(blockNode)
            this.blockNodeArr.push(blockNode)

            this.lastBlocKPosX += 200
        }
    },

    // 初始化物理引擎
    initPhysics () {
        let manager = cc.director.getPhysicsManager()
        manager.enabled = true
        manager.gravity = cc.v2(0, -2400)
    },

    // 加速
    boost (e) {
        console.log(123)
        if (this.ballNode.getComponent('ball').initVel) {
            let rigidBody = this.ballNode.getComponent(cc.RigidBody)
            rigidBody.linearVelocity = cc.v2(0, -1600)
            this.gameStart = 1
        }
    }
});
