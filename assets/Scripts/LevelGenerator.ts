import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc'
const { ccclass, property } = _decorator

@ccclass('LevelGenerator')
export class LevelGenerator extends Component {
	@property(Prefab)
	blockPrefab: Prefab = null

	@property
	rows: number = 5

	@property
	columns: number = 10

	@property
	blockSpacing: number = 10

	start() {
		this.generateLevel()
	}

	generateLevel() {
		if (!this.blockPrefab) {
			console.warn('Block prefab is not assigned')
			return
		}

		const blockSize = 100 // Assuming block size, adjust as needed
		const startX =
			-(this.columns * (blockSize + this.blockSpacing)) / 2 + blockSize / 2
		const startY = 700 // Starting Y position for blocks

		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.columns; col++) {
				const block = instantiate(this.blockPrefab)
				block.parent = this.node

				const x = startX + col * (blockSize + this.blockSpacing)
				const y = startY - row * (blockSize + this.blockSpacing)

				block.setPosition(new Vec3(x, y, 0))
			}
		}
	}
}
