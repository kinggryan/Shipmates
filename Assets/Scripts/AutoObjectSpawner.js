#pragma strict

@CustomEditor(AutoObjectSpawnerEditor)
class AutoObjectSpawnerEditor extends Editor
{
	function OnSceneGUI() {
		var targetCast = target as AutoObjectSpawner;
	
		Handles.DrawSolidArc(targetCast.transform.position,
							Vector3.forward,
							targetCast.localSpawnDirectionMinimum.normalized,
							Vector3.Angle(targetCast.localSpawnDirectionMinimum,targetCast.localSpawnDirectionMaximum),10.0);
	}
}

class AutoObjectSpawner extends MonoBehaviour 
{
	// Properties
	public var spawnPrefab:GameObject;
	public var localSpawnPosition:Vector2;
	public var localSpawnDirectionMinimum:Vector2;
	public var localSpawnDirectionMaximum:Vector2;
	public var spawnSpeedMinimum:float;
	public var spawnSpeedMaximum:float;
	public var spawnIntervalMinimum:float;
	public var spawnIntervalMaximum:float;
	
	// Methods
	function OnEnable() {
		Spawn();
	}
	
	function Spawn() {
		while(true) {
			// Determine an amount of time to wait
			yield(WaitForSeconds(Random.Range(spawnIntervalMinimum,spawnIntervalMaximum)));
			
			if(!enabled)
				return;
			
			// Then spawn an object
			var spawn = GameObject.Instantiate(spawnPrefab,transform.TransformPoint(localSpawnPosition),Quaternion.identity);
		
			// determine if the spawn has a rigidbody. If so, give it a velocity
			var rigid = spawn.GetComponent(Rigidbody2D);
		
			if(rigid != null) {
				var selfCollider = gameObject.GetComponent(Collider2D);
				var otherCollider = rigid.GetComponent(Collider2D);
			
				if(selfCollider != null && otherCollider != null)
					Physics2D.IgnoreCollision(otherCollider,selfCollider);
				
				var randRatio = Random.Range(0.0,1.0);
				var spawnVector = randRatio*transform.TransformDirection(localSpawnDirectionMinimum).normalized + (1-randRatio)*transform.TransformDirection(localSpawnDirectionMaximum).normalized;
				rigid.velocity = Random.Range(spawnSpeedMinimum,spawnSpeedMaximum)*spawnVector;
			}
		}
	}
}