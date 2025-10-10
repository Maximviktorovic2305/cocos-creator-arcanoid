import {
	_decorator,
	Component,
	EventKeyboard,
	EventTouch,
	Input,
	input,
	Node,
	Vec2,
	KeyCode,
	UITransform,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Ball')
export class Ball extends Component {
	vector: Vec2 = new Vec2(1, 2)
	isMoving: boolean = false
	speed: number = 1000
	isTapped: boolean = false
	tapTime: number

	@property(Node)
	platform: Node = null

	@property(Node)
	topWall: Node = null
	@property(Node)
	leftWall: Node = null
	@property(Node)
	rightWall: Node = null
	@property(Node)
	bottomWall: Node = null

	protected onLoad(): void {
		this.platform.on('moved', this.onPlatformMoved, this)
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)
	}

	// Manual collision detection
	checkWallCollisions() {
		// Get the ball's collider size
		const ballCollider = this.node.getComponent(UITransform)
		const ballWidth = ballCollider.contentSize.width
		const ballHeight = ballCollider.contentSize.height

		// Get the wall positions and sizes
		const leftWallTransform = this.leftWall.getComponent(UITransform)
		const rightWallTransform = this.rightWall.getComponent(UITransform)
		const topWallTransform = this.topWall.getComponent(UITransform)

		const leftWallRight =
			this.leftWall.x + leftWallTransform.contentSize.width / 2
		const rightWallLeft =
			this.rightWall.x - rightWallTransform.contentSize.width / 2
		const topWallBottom =
			this.topWall.y - topWallTransform.contentSize.height / 2

		// Check left and right wall collisions
		const ballLeft = this.node.x - ballWidth / 2
		const ballRight = this.node.x + ballWidth / 2

		if (ballLeft <= leftWallRight || ballRight >= rightWallLeft) {
			this.vector.x = -this.vector.x
		}

		// Check top wall collision
		const ballTop = this.node.y + ballHeight / 2
		if (ballTop >= topWallBottom) {
			this.vector.y = -this.vector.y
		}

		// Check platform collision (simplified)
		const platformTransform = this.platform.getComponent(UITransform)
		const platformTop =
			this.platform.y + platformTransform.contentSize.height / 2
		const platformLeft =
			this.platform.x - platformTransform.contentSize.width / 2
		const platformRight =
			this.platform.x + platformTransform.contentSize.width / 2

		const ballBottom = this.node.y - ballHeight / 2

		if (
			ballBottom <= platformTop &&
			this.node.x >= platformLeft &&
			this.node.x <= platformRight &&
			this.vector.y < 0
		) {
			// Only when ball is moving downward
			this.vector.y = -this.vector.y
		}

		// Check bottom wall collision (lose condition)
		const bottomWallTransform = this.bottomWall.getComponent(UITransform)
		const bottomWallTop =
			this.bottomWall.y + bottomWallTransform.contentSize.height / 2

		if (ballBottom <= bottomWallTop) {
			this.resetPosition()
		}
	}

	resetPosition() {
		this.isMoving = false
		this.node.y = -920
		this.vector = new Vec2(1, 2)
		this.node.x = this.platform.x
	}

	onPlatformMoved(pos: number) {
		if (this.isMoving) return

		this.node.x = pos
	}

	onKeyDown(e: EventKeyboard) {
		if (
			!this.isMoving &&
			(e.keyCode === KeyCode.ENTER || e.keyCode === KeyCode.SPACE)
		) {
			this.isMoving = true
		}
	}

	onTouchStart(e: EventTouch) {
		if (this.isMoving || e.getTouches().length !== 1) return

		let time = new Date().getTime()
		if (!this.isTapped) {
			this.isTapped = true
			this.tapTime = time
		} else {
			let timeDelta = time - this.tapTime
			if (timeDelta < 400) {
				this.isMoving = true
				this.isTapped = false
			} else {
				this.tapTime = time
			}
		}
	}

	update(deltaTime: number) {
		if (this.isMoving) {
			this.node.x += this.vector.x * deltaTime * this.speed
			this.node.y += this.vector.y * deltaTime * this.speed

			// Check for wall collisions
			this.checkWallCollisions()
		}
	}
}
