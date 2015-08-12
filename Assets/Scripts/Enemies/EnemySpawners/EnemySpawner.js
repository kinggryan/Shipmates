#pragma strict

class SpawnRegion
{
	var region:Rect;
	var rotationVector:Vector2;
	var rotationVectorVariance:float;
}

class EnemySpawner extends MonoBehaviour
{
	public var enemyPrefab:GameObject;
	
	// The squares where we can spawn enemies and their respective default rotation vectors as well as the variance for their rotation vectors
	public var spawnRegions:SpawnRegion[];
	
	public var spawnFrequencyMax:AnimationCurve;
	public var spawnFrequencyMin:AnimationCurve;
	
	public var levelLength:float = 120.0;
	private var levelTime:float = 0.0;
	
	function SpawnLoop() {
		while(levelTime < levelLength) {
			var timeLeft = Random.Range(spawnFrequencyMin.Evaluate(levelTime),spawnFrequencyMax.Evaluate(levelTime));
			levelTime += timeLeft;
			yield(WaitForSeconds(timeLeft));
			
			// Spawn an object
			var regionIndex = Mathf.Floor(Random.Range(0,spawnRegions.length));
			if(regionIndex == spawnRegions.length)
				regionIndex--;
				
			var spawnRegion = spawnRegions[regionIndex];
			
			var spawnLocation = Vector2(spawnRegion.region.x + Random.value*spawnRegion.region.width,spawnRegion.region.y + Random.value*spawnRegion.region.height);
			var spawnAngle = Quaternion.AngleAxis((Random.value - 0.5)*spawnRegion.rotationVectorVariance,Vector3.forward) * spawnRegion.rotationVector;
			
			var spawnRotation = Quaternion.LookRotation(Vector3.forward,spawnAngle.normalized);
			
			GameObject.Instantiate(enemyPrefab,spawnLocation,spawnRotation);
		}
	}
}