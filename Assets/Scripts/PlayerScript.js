#pragma strict

@RequireComponent(Rigidbody2D)
class PlayerScript extends MonoBehaviour {
	// MARK: Properties
	public var playerColor:Color;
	
	public var maxSpeed:float = 3.0;
	public var playerNumberLabel:String = "1";
	public var grabDistance:float = 0.5;
	public var grabDirectionMaxAngle:float = 1.0;
	
	public var keyboardMouseMode:boolean = true;
	
	public var highlightObject:GameObject;	// The object used to show what we can use.
	
	private var lookDirection:Vector2;	// The direction that we're looking in
	
	@HideInInspector
	public var heldObj:HoldableObject = null;
	
	// MARK: Methods	
	function Update() {
		// Perform movement
		var inputVector = Vector2(Input.GetAxis("Horizontal"+playerNumberLabel),Input.GetAxis("Vertical"+playerNumberLabel));
		if(inputVector.magnitude > 1.0) {
			inputVector = inputVector.normalized;
		}
		GetComponent.<Rigidbody2D>().velocity = inputVector * maxSpeed;
		
		// Figure out the direction we're looking in
		if(keyboardMouseMode) {
			var mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
			var correctedMousePosition = Vector2(mousePosition.x,mousePosition.y);
			lookDirection = (correctedMousePosition - transform.position).normalized;
		}
		else {
			var horizontalLook = Input.GetAxis("LookHorizontal"+playerNumberLabel);
			var verticalLook = Input.GetAxis("LookVertical"+playerNumberLabel);
			
			if(Mathf.Abs(horizontalLook) > 0.5 || Mathf.Abs(verticalLook) > 0.5)
				lookDirection = Vector2(horizontalLook,verticalLook).normalized;
		}
		
		var lookDirQuat = Quaternion.LookRotation(Vector3.forward,Vector3(lookDirection.x,lookDirection.y,0));
		GetComponent.<Rigidbody2D>().MoveRotation(lookDirQuat.eulerAngles.z);
		
		// grabcheck
		if(Input.GetButtonDown("Grab"+playerNumberLabel)) {
			if(heldObj == null)
				GrabAndUse();
			else {
				if(heldObj.CanUse(transform.position,lookDirection)) {
					heldObj.Use(this,transform.position,lookDirection);
				}
				else
					Throw();
			}
		}
		
		HighlightInteractionObjects();
	}
	
	function GrabAndUse() {
		var hitInfo = Physics2D.Raycast(transform.position,lookDirection,grabDistance);
		var holdObject:HoldableObject = null;
		var useObject:UsableObject = null;
		if(hitInfo != null && hitInfo.collider != null) {
			holdObject = hitInfo.collider.GetComponent(HoldableObject);
			
			useObject = hitInfo.collider.GetComponent(UsableObject);
		} 
			
		if(holdObject != null && holdObject.CanBePickedUp()) {
			holdObject.PickUp(this,transform.position+grabDistance*lookDirection,grabDistance);
			heldObj = holdObject;
			GetComponent.<Rigidbody2D>().centerOfMass = Vector2.zero;
		}
		
		if(useObject != null) {
			useObject.Use();
		}
	}
	
	function Throw() {
		heldObj.Throw(this,lookDirection);
		heldObj = null;
		
		GetComponent.<Rigidbody2D>().centerOfMass = Vector2.zero;
	}
	
	function OnCollisionEnter(collision:Collision) {
		Debug.Log(collision.collider);
	}
	
	function HighlightInteractionObjects() {
		highlightObject.GetComponent.<Renderer>().enabled = false;
	
		if(heldObj == null) {
			// Perform a raycast to see if we can grab or use anything. Highlight those objects
			var hitInfo = Physics2D.Raycast(transform.position,lookDirection,grabDistance);
			var holdObject:HoldableObject = null;
			var useObject:UsableObject = null;
			if(hitInfo != null && hitInfo.collider != null) {
				holdObject = hitInfo.collider.GetComponent(HoldableObject);
			
				useObject = hitInfo.collider.GetComponent(UsableObject);
			} 
			
			if(holdObject != null) {
				highlightObject.GetComponent.<Renderer>().enabled = true;
				highlightObject.transform.position = holdObject.transform.position;
			}
		
			if(useObject != null) {
				highlightObject.GetComponent.<Renderer>().enabled = true;
				highlightObject.transform.position = useObject.transform.position;
			}
		}
		else {
			if(heldObj.HighlightUseableObjects(highlightObject.transform,transform.position,lookDirection))
				highlightObject.GetComponent.<Renderer>().enabled = true;
		}
	}
}