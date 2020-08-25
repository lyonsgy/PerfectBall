cc.Class({
    extends: cc.Component,

    properties: {
        ballNode: cc.Node,
        blockPrefab: cc.Prefab,
        blockAreaNode: cc.Node,
        scoreLabel: cc.Label,
        alertNode: cc.Node,
        closeBtn: cc.Button,
        alertScoreLabel: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.alertNode.active = false
        this.initPhysics()
        this.initBlock()
        this.score = 0
        this.node.on('touchstart', this.boost, this)
        this.closeBtn.node.on(cc.Node.EventType.TOUCH_END, this.closeClick, this);
        this.gameStart = false
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
                    this.incrScore(1)
                    blockNode.x = this.getLastBlockPosX() + 180
                }
            }
        }
        if (this.ballNode.y < -cc.winSize.height / 2 && this.gameStart) {
            console.log('gameover')
            this.node.off('touchstart', this.boost, this)
            this.gameStart = false
            this.alertNode.active = true
        }
    },

    // 刷新得分
    incrScore (incr) {
        this.score += incr
        this.scoreLabel.string = this.score
        this.alertScoreLabel.string = this.score
    },

    // 获取最后一块跳板位置
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

            let width = 100 + (Math.random() > .5 ? 1 : -1) * (60 * Math.random())
            blockNode.getComponent('block').init(width)

            this.blockAreaNode.addChild(blockNode)
            this.blockNodeArr.push(blockNode)

            this.lastBlocKPosX += 180
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
            this.gameStart = true
        }
    },

    closeClick (e) {
        this.alertNode.active = false
        this.closeBtn.node.off(cc.Node.EventType.TOUCH_END, this.closeClick, this);
        cc.director.loadScene('game')
    }
});
