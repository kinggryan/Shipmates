#pragma strict

class Bucket extends MonoBehaviour {
	// Properties
	var waterAbsorber:HoldableObject;	//	This holdableobject absorbs water
	var waterTosser:HoldableObject;		// This holdableobject tosses water overboard
	
	var spilledWaterPrefab:GameObject;
	
	@HideInInspector
	var fullOfWater:boolean;			// If true, the water tosser is enabled. Otherwise, the water Absorber is enabled
	
	function ObjectUsed(obj:HoldableObject) {
		// If we picked up water, disable the water absorber and slow down the player.
		if(obj == waterAbsorber) {
			waterAbsorber.enabled = false;
			waterTosser.enabled = true;
			fullOfWater = true;
			
			waterTosser.holdingPlayer = waterAbsorber.holdingPlayer;
			waterTosser.holdingPlayer.heldObj = waterTosser;
			waterAbsorber.TransferRigidbodyValues(waterTosser);
			
			waterAbsorber.holdingPlayer.maxSpeed *= waterTosser.heldObjectSpeedMultiplier / waterAbsorber.heldObjectSpeedMultiplier;
		}
		else if(obj == waterTosser) {
			waterAbsorber.enabled = true;
			waterTosser.enabled = false;
			fullOfWater = false;
			
			waterAbsorber.holdingPlayer = waterTosser.holdingPlayer;
			waterAbsorber.holdingPlayer.heldObj = waterAbsorber;
			waterTosser.TransferRigidbodyValues(waterAbsorber);
			
			waterAbsorber.holdingPlayer.maxSpeed *= waterAbsorber.heldObjectSpeedMultiplier / waterTosser.heldObjectSpeedMultiplier;
		}
	}
	
	function ObjectRemovedFromPlayer(obj:HoldableObject) {
		if(obj == waterTosser) {
			waterAbsorber.enabled = true;
			waterTosser.enabled = false;
			fullOfWater = false;
			
			waterAbsorber.holdingPlayer = null;
			
			// Create spilled water
			gameObject.Instantiate(spilledWaterPrefab,transform.position,Quaternion.identity);
		}
		else if(obj == waterAbsorber) {
			waterTosser.holdingPlayer = null;
		}
	}
}