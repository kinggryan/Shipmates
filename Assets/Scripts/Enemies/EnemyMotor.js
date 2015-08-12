#pragma strict

class EnemyMotor extends MonoBehaviour
{
	// Properties
	public var movementSpeed:float = 1.0;
	public var localMoveDirection:Vector2 = Vector2.up;
	
	private var rigid:Rigidbody2D;
	
	// Methods
	function Start() {
		rigid = GetComponent(Rigidbody2D);
	}
	
	function Move() {
		rigid.velocity = transform.TransformDirection(localMoveDirection)*movementSpeed;
	}
	
	function Update() {
		Move();
	}
}