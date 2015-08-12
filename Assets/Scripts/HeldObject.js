#pragma strict

@RequireComponent(PlayerScript)
class HeldObject extends MonoBehaviour {
	public var speedMultiplier = 0.5;
	public var holdableObjectPrefab:GameObject;	// The prefab to generate when the object is put down
	
	function Start() {
		var pScript = GetComponent(PlayerScript);
		pScript.maxSpeed *= speedMultiplier;
	}
	
	function OnDestroy() {
		var pScript = GetComponent(PlayerScript);
		
		if(pScript != null) {
			pScript.maxSpeed /= speedMultiplier;
		}
	}
}