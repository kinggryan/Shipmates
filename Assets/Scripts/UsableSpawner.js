#pragma strict

// This class spawns an object when used
class UsableSpawner extends UsableObject {
	// Properties
	public var spawnedObject: Rigidbody2D;
	public var spawnPointLocal:Vector3;
	public var spawnVelocityLocal:Vector3;
	public var ignoreCollisionsWithSpawnedObjects:boolean = true;
	
	
	// Methods
	function Use() {
		super.Use();
	
		if(usable) {
			usable = false;
			
			// Create the object
			var obj = GameObject.Instantiate(spawnedObject,transform.TransformPoint(spawnPointLocal),Quaternion.identity);
			var rigid = obj.GetComponent(Rigidbody2D);
			rigid.velocity = transform.TransformDirection(spawnVelocityLocal);
			
			if(ignoreCollisionsWithSpawnedObjects) {
				var thiscollider = this.GetComponent(Collider2D);
				var othercollider = rigid.GetComponent(Collider2D);
			
				if(thiscollider != null && othercollider != null) 
					Physics2D.IgnoreCollision(thiscollider,othercollider);
			}
		}
	}
}