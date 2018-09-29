var is502 = false;
function detect502()
{
	var res;
	try
	{
		res = $("center")
			.eq(0)
			.text()
			.startsWith("50");
	} catch (error)
	{
		return false;
	}
	return res;
}
var detect502Timer;

function reloadIf502()
{
	is502 = detect502();
	if (is502 == true)
	{
		setTimeout(() =>
		{
			window.location.href = "";
		}, 3000);
	}
}



$(document).ready(function ()
{
	reloadIf502();
	detect502Timer = setInterval(function ()
	{
		reloadIf502();
	}, 10000);
	//myTimerArray.push(detect502Timer);
});

log("code502.js Loaded");