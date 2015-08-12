#pragma strict

class HoldableUserObject extends MonoBehaviour
{
	public var useIdentifier:String = "Default";
	
	public function IsUsable() : boolean {
		return true;
	}
	
	public function Use(holdableObject:HoldableObject) {
		// Subclass for specific functionality
	}
}