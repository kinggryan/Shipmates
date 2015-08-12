#pragma strict

class HoldableObjectAbsorber extends HoldableUserObject
{
	public var usableObject:UsableObject = null;
		
	private var isUsable : boolean = true;
	
	function IsUsable() : boolean {
		return isUsable;
	}
	
	function setIsUsable(use:boolean) {
		isUsable = use;
	}
	
	function Use(holdableObj:HoldableObject) {
		holdableObj.RemoveFromPlayer();
		gameObject.Destroy(holdableObj.gameObject);
		if(usableObject != null) {
			usableObject.ObjectAbsorbed();
		}
		return;
	}
}