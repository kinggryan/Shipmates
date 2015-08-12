#pragma strict

class HoldableObject extends MonoBehaviour {
	// Properties
	public var heldObjectSpeedMultiplier:float = 0.5;
	public var throwForce:float = 3.0;
	
	public var useDistance:float = 0.3;
	
	public var useIdentifier:String = "Default";	// Used when checking absorbers and object slots to dettermine whether this is a valid obj
	
	@HideInInspector
	public var holdingPlayer:PlayerScript;
	
	private var rigidbody2d:Rigidbody2D;
	
	private var rigidbodyLinearDrag:float;
	private var rigidbodyAngularDrag:float;
	private var rigidbodyMass:float;
	
	// Methods
	function Start() {
		rigidbody2d = GetComponent(Rigidbody2D);
	}
	
	function CanBePickedUp() {
		return(holdingPlayer == null);
	}
	
	function PickUp(player:PlayerScript, attachmentPoint:Vector3, attachmentDistance:float) {	
		// Disable the rigidbody
		rigidbodyMass = rigidbody2d.mass;
		rigidbodyLinearDrag = rigidbody2d.drag;
		rigidbodyAngularDrag = rigidbody2d.angularDrag;
		gameObject.Destroy(rigidbody2d);
		
		// Disable slot
		SendMessage("ObjectPickedUp",SendMessageOptions.DontRequireReceiver);
		
		// set self as the child of the object
		transform.parent = player.transform;
		holdingPlayer = player;
	
		// Attach to the attachment point
		transform.position = attachmentPoint; 
		
		player.maxSpeed *= heldObjectSpeedMultiplier;
		
	}
	
	function Throw(player:PlayerScript,direction:Vector2) {
		// Add a force in the direction
		RemoveFromPlayer();
		
		rigidbody2d.AddForce(direction*throwForce,ForceMode2D.Impulse);
	}
	
	// Returns true if the object can be used
	function CanUse(playerPosition:Vector2,lookDirection:Vector2) : boolean 
	{
		return(GetUseableObject(playerPosition,lookDirection) != null);
	}
	
	function GetUseableObject(playerPosition:Vector2,lookDirection:Vector2) : HoldableUserObject
	{
		// First, add self to the ignore raycast layer
		var storedLayer = gameObject.layer;
		gameObject.layer = 2;	// The ignore raycast layer
		var hitInfo = Physics2D.Raycast(playerPosition,lookDirection,useDistance);
		gameObject.layer = storedLayer;
		
		if(hitInfo.collider != null) {
			var useScript = hitInfo.collider.GetComponent(HoldableUserObject);
			if(useScript != null && useScript.IsUsable() && useScript.useIdentifier == this.useIdentifier) {
				// we can use this
				return useScript;
			}
		}
		
		return null;
	}
	
	function Use(player:PlayerScript,playerPosition:Vector2,lookDirection:Vector2) : boolean 
	{
		var useScript = GetUseableObject(playerPosition,lookDirection);
	
		if(useScript == null)
			return false;
		
		useScript.Use(this);
		SendMessage("ObjectUsed",this,SendMessageOptions.DontRequireReceiver);
		
		return true;
	}
	
	function RegainRigidbody() {
		// Add a force in the direction
		transform.parent = null;
		
		if(gameObject.GetComponent(Rigidbody2D) == null) {
			rigidbody2d = gameObject.AddComponent(Rigidbody2D);
		}
		else {
			rigidbody2d = gameObject.GetComponent(Rigidbody2D);
		}
		rigidbody2d.mass = rigidbodyMass;
		rigidbody2d.drag = rigidbodyLinearDrag;
		rigidbody2d.angularDrag = rigidbodyAngularDrag;
		rigidbody2d.gravityScale = 0;
	}
	
	function RemoveFromPlayer() {
		if(holdingPlayer == null) {
			return;
		}
	
		RegainRigidbody();
		holdingPlayer.maxSpeed /= heldObjectSpeedMultiplier;
		holdingPlayer.GetComponent.<Rigidbody2D>().centerOfMass = Vector2.zero;
		holdingPlayer = null;
		
		SendMessage("ObjectRemovedFromPlayer",this,SendMessageOptions.DontRequireReceiver);
	}
	
	function SetRigidbodyValues(lDrag:float,aDrag:float,mass:float) {
		rigidbodyLinearDrag = lDrag;
		rigidbodyAngularDrag = aDrag;
		rigidbodyMass = mass;
	}
	
	function TransferRigidbodyValues(toHoldable:HoldableObject)
	{
		toHoldable.SetRigidbodyValues(rigidbodyLinearDrag,rigidbodyAngularDrag,rigidbodyMass);
	}	
	
	function HighlightUseableObjects(highlightObject:Transform,playerPosition:Vector2,playerLook:Vector2) : boolean
	{
		var useScript = GetUseableObject(playerPosition,playerLook);
		
		if(useScript != null) {
			highlightObject.position = useScript.transform.position;
			return true;
		}
		
		return false;
	}
}