#pragma strict

class SlotObject extends MonoBehaviour
{
	// Properties
	public var breakIdentifier:String = "Default";
	public var slot:HoldableObjectSlot = null;

	// Methods
	function OnCollisionEnter2D(collision:Collision2D) {
		if(collision.collider != null) {
			var breaker = collision.collider.GetComponent(SlotBreaker);
			
			if(breaker != null && breakIdentifier == breaker.breakIdentifier) {
				// Destroy this and any rigidbody constraints
				BreakSlot();
			}
		}
	}
	
	function BreakSlot() {
		var rigid = gameObject.GetComponent(Rigidbody2D);
		if(rigid != null) {
			rigid.constraints = RigidbodyConstraints2D.None;
		}
		slot.SlotBroke();
		gameObject.Destroy(this);
	}
	
	function ObjectPickedUp() {
		BreakSlot();
	}
}