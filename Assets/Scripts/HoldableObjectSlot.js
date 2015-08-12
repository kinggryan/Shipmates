#pragma strict

class HoldableObjectSlot extends HoldableUserObject
{
	// Properties
	public var objectInSlot:HoldableObject = null;
	public var localSlotPosition:Vector2 = Vector2.zero;
	public var breakIdentifier:String = "Default";
	
	// Methods
	function Start() {
		if(objectInSlot != null) {
			Use(objectInSlot);
		}
	}
	
	function IsUsable() {
		return(objectInSlot == null);
	}
	
	function Use(holdableObj:HoldableObject) {
		// place the object into the slot
		holdableObj.RemoveFromPlayer();
		objectInSlot = holdableObj;
		holdableObj.transform.position = transform.TransformPoint(localSlotPosition);
		holdableObj.transform.rotation = transform.rotation;
		var rigid = holdableObj.GetComponent(Rigidbody2D);
		if(rigid != null) {
			rigid.constraints = RigidbodyConstraints2D.FreezeAll;
		}
		var slotObj = holdableObj.gameObject.AddComponent(SlotObject);
		slotObj.slot = this;
		slotObj.breakIdentifier = breakIdentifier;
		
		SendMessage("ObjectPutIntoSlot",SendMessageOptions.DontRequireReceiver);
	}
	
	function SlotBroke() {
		objectInSlot = null;
		SendMessage("HoldableObjectSlotBroke",SendMessageOptions.DontRequireReceiver); 
	}
}