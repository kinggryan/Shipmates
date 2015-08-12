#pragma strict

class TimedReloader extends MonoBehaviour
{
	public var autoReloadDelay:float = 1.0;

	function ObjectUsed(obj:UsableObject) {
		yield(WaitForSeconds(autoReloadDelay));
		obj.usable = true;
	}
}