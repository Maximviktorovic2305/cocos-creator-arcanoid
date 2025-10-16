import {
	_decorator,
	Component,
	input,
	Input,
	KeyCode,
	Node,
	UITransform,
	EventKeyboard,
	EventTouch,
	Vec3,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Platform')
export class Platform extends Component {
	@property
	public moveSpeed: number = 10

	sideX: number = 0
	moving: boolean = false
	x: number = 0
	maxPos: number = 0
	minPos: number = 0

	protected onLoad(): void {
		// Calculate movement boundaries
		this.calculateBoundaries()

		// Listen for input events
		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.on(Input.EventType.KEY_UP, this.onKeyUp, this)

		// Listen for touch events on the canvas
		const canvas = this.node.parent
		if (canvas) {
			canvas.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
			canvas.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
			canvas.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
			canvas.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
		}
	}

	calculateBoundaries() {
		const parentUITransform = this.node.parent?.getComponent(UITransform)
		const platformUITransform = this.node.getComponent(UITransform)

		if (parentUITransform && platformUITransform) {
			this.maxPos =
				parentUITransform.contentSize.width / 2 -
				platformUITransform.contentSize.width / 2
			this.minPos = -this.maxPos
		}
	}

	onTouchStart(e: EventTouch) {
		this.moving = true
		this.moveToTouch(e)
	}

	onTouchMove(e: EventTouch) {
		if (!this.moving) return
		this.moveToTouch(e)
	}

	onTouchEnd(e: EventTouch) {
		this.moving = false
	}

	moveToTouch(e: EventTouch) {
		// Convert touch position to local position
		const touchPos = e.getUILocation()
		const worldPos = this.node
			.parent!.getComponent(UITransform)!
			.convertToNodeSpaceAR(new Vec3(touchPos.x, touchPos.y, 0))
		this.setPosition(worldPos.x)
	}

	onKeyDown(e: EventKeyboard) {
		switch (e.keyCode) {
			case KeyCode.ARROW_LEFT:
				this.sideX = -1
				break
			case KeyCode.ARROW_RIGHT:
				this.sideX = 1
				break
		}
	}

	onKeyUp(e: EventKeyboard) {
		if (e.keyCode === KeyCode.ARROW_LEFT || e.keyCode === KeyCode.ARROW_RIGHT) {
			this.sideX = 0
		}
	}

	setPosition(pos: number) {
		// Clamp position to boundaries
		const newPos = Math.max(this.minPos, Math.min(this.maxPos, pos))
		this.node.setPosition(newPos, this.node.position.y, this.node.position.z)
	}

	update(deltaTime: number) {
		// Move platform based on keyboard input
		if (this.sideX !== 0) {
			const newPosition = this.node.position.x + this.moveSpeed * this.sideX
			this.setPosition(newPosition)
		}
	}

	protected onDestroy(): void {
		// Clean up event listeners
		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this)

		const canvas = this.node.parent
		if (canvas) {
			canvas.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
			canvas.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
			canvas.off(Node.EventType.TOUCH_END, this.onTouchEnd, this)
			canvas.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)
		}
	}
}
