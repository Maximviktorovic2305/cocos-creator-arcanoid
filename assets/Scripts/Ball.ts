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
	RigidBody2D,
	Contact2DType,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Ball')
export class Ball extends Component {
	@property
	ballSpeed: number = 500

	isMoving: boolean = false
	body: RigidBody2D

	@property(Node)
	platform: Node = null

	protected onLoad(): void {
		// Get or add the rigidbody component
		this.body = this.node.getComponent(RigidBody2D)
		if (!this.body) {
			console.warn(
				'RigidBody2D component is missing on the ball node, adding it now',
			)
			this.body = this.node.addComponent(RigidBody2D)
		}

		// Configure the rigidbody for proper physics
		this.body.type = 2 // Dynamic body
		this.body.enabledContactListener = true
		this.body.allowSleep = false

		// Listen for input events
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)

		// Register contact listener
		this.node.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
	}

	startBall() {
		if (this.isMoving) return

		this.isMoving = true

		// Position the ball on the platform
		if (this.platform) {
			this.node.setPosition(
				this.platform.position.x,
				this.platform.position.y + 30,
				0,
			)
		}

		// Launch the ball with a random direction
		if (this.body) {
			const angle = (Math.random() * Math.PI) / 3 + Math.PI / 3 // Random angle between 30-60 degrees
			const vx =
				this.ballSpeed * Math.cos(angle) * (Math.random() > 0.5 ? 1 : -1)
			const vy = this.ballSpeed * Math.sin(angle)
			this.body.linearVelocity = new Vec2(vx, vy)
		}
	}

	resetBall() {
		this.isMoving = false

		// Reset ball position to platform position
		if (this.platform) {
			this.node.setPosition(
				this.platform.position.x,
				this.platform.position.y + 30,
				0,
			)
		}

		// Reset velocity
		if (this.body) {
			this.body.linearVelocity = new Vec2(0, 0)
		}
	}

	onBeginContact(contact: any, selfCollider: any, otherCollider: any) {
		// If ball hits the bottom wall, reset it
		if (otherCollider.node.name === 'bottom_wall') {
			this.resetBall()
		}
	}

	onTouchStart(e: EventTouch) {
		// Launch the ball on touch
		this.startBall()
	}

	onKeyDown(e: EventKeyboard) {
		// Launch the ball on space or enter
		if (
			!this.isMoving &&
			(e.keyCode === KeyCode.SPACE || e.keyCode === KeyCode.ENTER)
		) {
			this.startBall()
		}
	}

	update(deltaTime: number) {}
}
