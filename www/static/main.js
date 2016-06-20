/*
 * Copyright (c) 2014, 2016 Gonçalo Baltazar <me@goncalomb.com>
 * Samaritan is released under the terms of the MIT License,
 * check the file LICENSE.txt.
 */

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

	window.audioSetTimeEvents = function(audio, events) {
		$(audio).on("timeupdate", function() {
			for (var key in events) {
				if (this.currentTime > key) {
					if (typeof events[key] === "function") {
						events[key]();
					} else {
						var obj = (events[key][0] || window);
						obj[events[key][1]].apply(obj, events[key][2]);
					}
					delete events[key];
				}
			}
		});
	}

	window.audioStart = function(audio, time, fadein_time) {
		audio.currentTime = time;
		if (fadein_time) {
			audio.volume = 0;
			$(audio).on("timeupdate", function fn() {
				var dt = this.currentTime - time;
				if (dt < fadein_time) {
					this.volume = dt/fadein_time;
				} else {
					this.volume = 1;
					$(audio).off("timeupdate", fn);
				}
			});
		} else {
			audio.volume = 1;
		}
		audio.play();
	}

	window.tryPlayAudio = function(audio, time, fadein_time) {
		function doPlayAudio() {
			audioStart(audio, time, fadein_time);
			setTimeout(function() {
				if (audio.paused) {
					// mobile browser? we need user interaction
					$(document).click(function fn() {
						$(this).off("click", fn);
						showSubtitle(null);
						audio.play();
					});
					showSubtitle("(tap the screen)", -1);
				}
			}, 100);
		}
		if (audio.readyState == 4) {
			doPlayAudio()
		} else {
			$(audio).on("canplay", function fn() {
				$(this).off("canplay", fn);
				doPlayAudio();
			});
		}
	}

	window.showSubtitle = function(text, time) {
		var $subtitle = $("#subtitle");
		if (!text) {
			$subtitle.css("opacity", "0")
			return;
		}
		$subtitle.text("\"" + text + "\"");
		$subtitle.css("opacity", "");
		if (!time || time >= 0) {
			setTimeout(function() {
				showSubtitle(null);
			}, time || 1500);
		}
	}

});
