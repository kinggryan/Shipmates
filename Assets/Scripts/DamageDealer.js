#pragma strict

class DamageDealer extends MonoBehaviour
{
	// Properties
	public var damageDealt:int = 1.0;
	
	// Methods
	function OnCollisionEnter2D(collision:Collision2D) {
		// check to make sure there's a receiver
		if(collision.collider != null) {
			var dr = collision.collider.GetComponent(DamageReceiver);
			if(dr != null) {
				DealDamage(dr);
			}
		}
	}
	
	function DealDamage(dr:DamageReceiver)
	{
		dr.TakeDamage(damageDealt);
		gameObject.Destroy(gameObject);
	}
}