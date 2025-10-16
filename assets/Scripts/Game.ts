import {
	_decorator,
	Component,
	PhysicsSystem2D,
	EPhysics2DDrawFlags,
	Node,
	Vec2,
} from 'cc'
const { ccclass, property } = _decorator

@ccclass('Game')
export class Game extends Component {
	@property(Node)
	ball: Node = null

	@property(Node)
	platform: Node = null

	protected onLoad(): void {
		// Enable 2D physics system
		PhysicsSystem2D.instance.enable = true

		// Optionally enable debug drawing to visualize colliders
		PhysicsSystem2D.instance.debugDrawFlags =
			EPhysics2DDrawFlags.Aabb |
			EPhysics2DDrawFlags.Pair |
			EPhysics2DDrawFlags.CenterOfMass |
			EPhysics2DDrawFlags.Joint |
			EPhysics2DDrawFlags.Shape
	}

	protected start(): void {
		// Initialize game state
		if (this.ball && this.platform) {
			// Reset ball to start position
			this.ball.setPosition(
				this.platform.position.x,
				this.platform.position.y + 30,
				0,
			)
		}
	}

	update(deltaTime: number) {
		// Game loop logic can be added here
	}
}
