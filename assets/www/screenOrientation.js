var screenOrientation = function() {}

screenOrientation.prototype.set = function(str, success, fail) {
    cordova.exec(success, fail, "ScreenOrientation", "set", [str]);
};
navigator.screenOrientation = new screenOrientation();


function setScreenOrientation() {
	console.log("**** we're in setScreenOrientation ****");
	if (page.init.page() == 'video') {
		console.log("we are currently viewing the video page");
		window.screenOrientation.set("sensor");
	} else {
		console.log("we are not viewing the video page");
		window.screenOrientation.set("portrait"); // how do we get this to be portrait but also keep receiving notifications about screen orientation?
	}
}