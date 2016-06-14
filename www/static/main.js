$(document).ready(function() {
	var $text = $("#samaritan .text");
	var $line = $("#samaritan .line");
	var $arrow = $("#samaritan .arrow");

	var parts;
	var i = -1;
	var endCallback;

	function firstPlayText() {
		$text.addClass("hidden").text(parts[i].replace(/_+/g, " "));
		$line.width($text.width() + 10);
		setTimeout(secondPlayText, 100);
	}

	function secondPlayText() {
		$text.removeClass("hidden");
		if (++i < parts.length) {
			setTimeout(firstPlayText, 400);
		} else {
			setTimeout(endPlayText, 400);
		}
	}

	function endPlayText() {
		$text.addClass("hidden").text("-");
		$line.css("width", "");
		$arrow.addClass("arrow-animation");
		i = -1;
		if (endCallback) {
			endCallback();
			endCallback = null;
		}
	}

	var samaritan = { }

	samaritan.playText = function(text, callback) {
		if (i == -1) {
			parts = text.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").split(" ");
			i = 0;
			$arrow.removeClass("arrow-animation");
			if (callback) {
				endCallback = callback;
			}
			setTimeout(firstPlayText, 0);
		}
	}

	samaritan.enlarge = function(text, width, callback) {
		if (i == -1) {
			i = 0;
			$arrow.removeClass("arrow-animation");
			$line.width(width);
			setTimeout(function() {
				$text.removeClass("hidden").text(text);
				i = -1;
				if (callback) {
					callback();
				}
			}, 200);
		}
	}

	function showSubtitle(text, time) {
		$subtitle = $("#subtitle");
		if (!text) {
			$subtitle.css("opacity", "0")
		} else {
			$subtitle.text("\"" + text + "\"");
			$subtitle.css("opacity", "");
			setTimeout(function() {
				showSubtitle("");
			}, time | 1500);
		}
	}

	window.samaritan = samaritan;
});
