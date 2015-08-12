#pragma strict

class EnemyShip extends MonoBehaviour
{
	function ObjectDied(dr:DamageReceiver)
	{
		gameObject.Destroy(gameObject);
	}
}