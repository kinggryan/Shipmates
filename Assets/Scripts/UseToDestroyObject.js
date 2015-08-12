#pragma strict

class UseToDestroyObject extends HoldableUserObject
{
	function Use(holdableObject:HoldableObject) {
		gameObject.Destroy(gameObject);
	}
}