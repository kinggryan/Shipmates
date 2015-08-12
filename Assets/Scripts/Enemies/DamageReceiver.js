#pragma strict

class DamageReceiver extends MonoBehaviour 
{
	// Properties
	var hp:int = 1;
	
	// Methods
	function TakeDamage(damage:int) {
		hp -= damage;
		
		if(hp <= 0)
			Die();
	}
	
	function Die() {
		SendMessage("ObjectDied",this,SendMessageOptions.DontRequireReceiver);
	}
}