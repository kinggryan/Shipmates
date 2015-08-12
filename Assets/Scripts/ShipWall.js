#pragma strict

class ShipWall extends MonoBehaviour {
	public var waterSpawner:MonoBehaviour;

	function HoldableObjectSlotBroke() {
		waterSpawner.enabled = true;
	}
	
	function ObjectPutIntoSlot() {
		waterSpawner.enabled = false;
	}
}