#pragma strict

class UsableObject extends MonoBehaviour {
	// Properties
	public var usable = false;
	
	function Use() {
		// Send messages
		if(usable)
			SendMessage("ObjectUsed",this,SendMessageOptions.DontRequireReceiver);
		return;
	}
	
	function ObjectAbsorbed() {
		usable = true;
	}
}