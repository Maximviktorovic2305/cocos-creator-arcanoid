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
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Platform')
export class Platform extends Component {
	@property
	public Delta: number = 20

	sideX: number = 0
	moving: boolean = false
	x: number
	maxPos: number
	minPos: number

	protected onLoad(): void {
		this.maxPos =
			(this.node.parent.getComponent(UITransform) as UITransform).contentSize
				.width /
				2 -
			(this.node.getComponent(UITransform) as UITransform).contentSize.width / 2
		this.minPos =
			-(this.node.parent.getComponent(UITransform) as UITransform).contentSize
				.width /
				2 +
			(this.node.getComponent(UITransform) as UITransform).contentSize.width / 2

		input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.on(Input.EventType.KEY_UP, this.onKeyUp, this)

		let canvas = this.node.parent
		canvas.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
		canvas.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
		canvas.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
		canvas.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
	}

	onTouchStart(e: EventTouch) {
		this.moving = true
		this.x = this.node.x
	}
	onTouchEnd(e: EventTouch) {
		this.moving = false
	}
	onTouchCancel(e: EventTouch) {
		this.moving = false
	}
	onTouchMove(e: EventTouch) {
		if (!this.moving) return

		this.x += e.getDeltaX()
	}

	onKeyDown(e: EventKeyboard) {
		if (e.keyCode == KeyCode.ARROW_LEFT) {
			this.sideX = -1
		} else if (e.keyCode == KeyCode.ARROW_RIGHT) {
			this.sideX = 1
		} else return
	}

	onKeyUp(e: EventKeyboard) {
		if (e.keyCode == KeyCode.ARROW_LEFT || e.keyCode == KeyCode.ARROW_RIGHT) {
			this.sideX = 0
		}
	}

	setPosition(pos: number) {
		let newPos = pos

		if (newPos > this.maxPos) {
			newPos = this.maxPos
		} else if (newPos < this.minPos) {
			newPos = this.minPos
		}
		this.node.x = newPos
		this.node.emit('moved', newPos)
	}

	updateByKeys() {
		if (this.sideX == 0) return
		this.setPosition(this.node.x + this.Delta * this.sideX)
	}

	updateByTouch() {
		this.setPosition(this.x)
	}

	update(deltaTime: number) {
		if (this.moving) {
			this.updateByTouch()
			return
		}

		this.updateByKeys()
	}

	protected onDestroy(): void {
		let canvas = this.node.parent

		input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this)
		input.off(Input.EventType.KEY_UP, this.onKeyUp, this)

		canvas.off(Node.EventType.TOUCH_START, this.onTouchStart, this)
		canvas.off(Node.EventType.TOUCH_END, this.onTouchEnd, this)
		canvas.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this)
		canvas.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
	}
}
