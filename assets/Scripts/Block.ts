import { _decorator, Component, Contact2DType } from 'cc'
const { ccclass, property } = _decorator

@ccclass('Block')
export class Block extends Component {
	protected onLoad(): void {
		// Register contact listener
		this.node.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
	}

	onBeginContact(contact: any, selfCollider: any, otherCollider: any) {
		// When ball hits the block, destroy the block
		if (otherCollider.node.name === 'ball') {
			this.node.destroy()
		}
	}
}
