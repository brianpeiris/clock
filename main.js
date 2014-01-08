(function ($) {
	var clock, hours, minutes, seconds;

	$.fn.clock = function () {
		clock = this;

		hours = clock.find(".hours");
		minutes = clock.find(".minutes");
		seconds = clock.find(".seconds");

		setInterval(tick, 500);

		return clock;
	};

	function tick() {
		var
			time = new Date()
			, _hours = time.getHours()
			, _minutes = time.getMinutes()
			, _seconds = time.getSeconds();

		hours.text(pad(_hours));
		minutes.text(pad(_minutes));
		seconds.text(pad(_seconds));

		clock.trigger(
			"tick"
			, [
				time.getTime()
				, _hours
				, _minutes
				, _seconds
			]
		);
	}

	function pad(text, num) {
		num = num || 2;
		text = text.toString();
		var originalTextLength = text.length;
		for (var ii = 0; ii < (num - originalTextLength); ii++) {
			text = "0" + text;
		}
		return text;
	}
})(jQuery);

$(function () {
	var
		dateOutput = $("#date")
		, minuteProgress = $("#minuteProgress")
		, hourProgress = $("#hourProgress")
		, dayProgress = $("#dayProgress")
		, weekProgress = $("#weekProgress")
		, monthProgress = $("#monthProgress")
		, yearProgress = $("#yearProgress")
		, decadeProgress = $("#decadeProgress")
		, daysThisMonth = getDaysThisMonth()
		, SECONDS_PER_MINUTE = 60
		, SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE
		, SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR
		, SECONDS_PER_WEEK = 7 * SECONDS_PER_DAY
		, SECONDS_THIS_MONTH = daysThisMonth * SECONDS_PER_DAY
		, MONTHS_PER_YEAR = 12
		, YEARS_PER_DECADE = 10
		, dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		, monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	$("#clock").clock().bind("tick", function (event, time, hours, minutes, seconds) {
		var
			time = new Date(time)	
			, days = time.getDay()
			, date = time.getDate()
			, month = time.getMonth()
			, century = Math.floor(time.getFullYear() / 10) * 10
			, yearThisDecade = time.getFullYear() - century
			, _hourProgress = minutes * SECONDS_PER_MINUTE + seconds
			, _dayProgress = hours * SECONDS_PER_HOUR + _hourProgress
			, _weekProgress = days * SECONDS_PER_DAY + _dayProgress
			, _monthProgress = date * SECONDS_PER_DAY + _dayProgress
			, _yearProgress = month * SECONDS_THIS_MONTH + _monthProgress
			, _decadeProgress =  yearThisDecade * MONTHS_PER_YEAR * SECONDS_THIS_MONTH + _yearProgress
			, plots = [
				[minuteProgress, seconds, SECONDS_PER_MINUTE, '#FF2800']
				, [hourProgress, _hourProgress, SECONDS_PER_HOUR, '#FF8B00', function (x) { return x / SECONDS_PER_HOUR * 60; }, 5 * SECONDS_PER_MINUTE]
				, [dayProgress, _dayProgress, SECONDS_PER_DAY, '#0780CC', function (x) { return x / SECONDS_PER_DAY * 24; }, 1 * SECONDS_PER_HOUR]
				, [weekProgress, _weekProgress, SECONDS_PER_WEEK, '#00DA4A', function (x) { return dayNames[x / SECONDS_PER_WEEK * 7] || ""; }, 1 * SECONDS_PER_DAY]
				, [monthProgress, _monthProgress, SECONDS_THIS_MONTH, '#FF2800', function (x) { return x / SECONDS_THIS_MONTH * daysThisMonth; }, 7 * SECONDS_PER_DAY]
				, [yearProgress, _yearProgress, SECONDS_THIS_MONTH * MONTHS_PER_YEAR, '#FF8B00', function (x) { return monthNames[x / SECONDS_THIS_MONTH] || ""; }, SECONDS_THIS_MONTH]
				, [decadeProgress, _decadeProgress, SECONDS_THIS_MONTH * MONTHS_PER_YEAR * YEARS_PER_DECADE, '#0780CC', function (x) { return x / SECONDS_THIS_MONTH / MONTHS_PER_YEAR + century; }, MONTHS_PER_YEAR * SECONDS_THIS_MONTH]
			];
			for (var plotIndex in plots) {
				plot.apply(this, plots[plotIndex]);
			}
		dateOutput.text((new Date()).toDateString());
	});

	function getDaysThisMonth(date) {
		date = date || new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() + 1);
		date.setDate(0);
		return date.getDate();
	}

	function plot(element, value, max, color, formatter, interval) {
		$.plot(
			element
			, [[[value, 0]]]
			, {
				series: {
					bars: { show: true, horizontal: true, lineWidth: 0, fillColor: color }
					, shadowSize: 0
				}
				, xaxis: { min: 0, max: max, tickFormatter: formatter, tickSize: interval }
				, yaxis: { min: 0, max: 1, ticks: 0 }
				, grid: { aboveData: true, color: 'white', tickColor: 'white', borderWidth: 1, borderColor: 'white' }
			}
		);
	}

	$('#increase_size').click(function (e) {
		var fontSize = parseInt($('#container').css('fontSize'), 10);
		$('#container').css({fontSize: fontSize + 10});
		e.preventDefault();
	});
});
