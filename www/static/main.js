$(document).ready(function() {

	// samaritan

	var $samaritan = $("#samaritan");
	var $samaritan_text = $("#samaritan .text");
	var $samaritan_line = $("#samaritan .line");
	var $samaritan_arrow = $("#samaritan .arrow");
	var $samaritan_message_box = $("#samaritan .message-box");

	var samaritan = window.samaritan = { }
	var timeout = 0;

	samaritan.clear = function(mode) {
		clearTimeout(timeout);
		$samaritan.removeClass("mode-text mode-text-black mode-message-box");
		$samaritan_text.text("-");
		$samaritan_line.css("width", "");
		$samaritan_arrow.removeClass("arrow-animation");
		$samaritan.addClass("mode-" + (mode ? mode : "text"))
	}

	samaritan.textAnimate = function(text) {
		this.clear("text");
		var parts = text.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").split(" ");
		if (parts.length == 0 || (parts.length == 1 && parts[0] === "")) {
			$samaritan_text.addClass("hidden").text("-");
			$samaritan_line.css("width", "");
			$samaritan_arrow.addClass("arrow-animation");
			return;
		}
		var i = 0;
		function textAnimate_loop0() {
			$samaritan_text.addClass("hidden").text(parts[i].replace(/_+/g, " "));
			$samaritan_line.width($samaritan_text.width() + 10);
			timeout = setTimeout(textAnimate_loop1, 100);
		}
		function textAnimate_loop1() {
			$samaritan_text.removeClass("hidden");
			if (++i < parts.length) {
				timeout = setTimeout(textAnimate_loop0, 400);
			} else {
				timeout = setTimeout(function() {
					$samaritan_text.addClass("hidden").text("-");
					$samaritan_line.css("width", "");
					$samaritan_arrow.addClass("arrow-animation");
				}, 400);
			}
		}
		timeout = setTimeout(textAnimate_loop0);
	}

	samaritan.textBlack = function(text) {
		this.clear("text-black");
		$samaritan_text.removeClass("hidden").text(text);
	}

	samaritan.showMessageBox = function(title, message) {
		this.clear("message-box");
		$samaritan_message_box.addClass("hidden");
		$(".message-box-title", $samaritan_message_box).text(title);
		$(".message-box-text", $samaritan_message_box).text(message ? message : "").append($("<span>").addClass("fast-flash").text("_"));
		setTimeout(function() {
			$samaritan_message_box.removeClass("hidden");
		}, 10);
	}

	samaritan.hideMessageBox = function(title, message) {
		if ($samaritan.hasClass("mode-message-box")) {
			$samaritan_message_box.addClass("hidden");
		}
		var self = this;
		setTimeout(function() {
			self.textAnimate("");
		}, 300);
	}

	samaritan.enlarge = function(text) {
		this.clear("text");
		$samaritan_text.addClass("hidden").text(text);
		$samaritan_line.width($samaritan_text.width() + 80);
		setTimeout(function() {
			$samaritan_text.removeClass("hidden");
		}, 200);
	}

	// other

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

});
