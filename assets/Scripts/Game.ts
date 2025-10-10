import { _decorator, Component, PhysicsSystem2D } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Game')
export class Game extends Component {
	protected onLoad(): void {
		PhysicsSystem2D.instance.enable = true
	}

	update(deltaTime: number) {}
}
