// 2017-09-06
define([
	'df', 'df-lodash', 'jquery', 'ko', 'Df_Phone/lib/js/main'
], function (df, _, $, ko) {return (
/**
 * 2017-09-06
 * @param {Object} c
 * @param {String[]} c.countries
 * @param {String} c.utils
 */
function(c) {ko.bindingHandlers['df-phone'] = {init: function(e, accessor) {var config = accessor(); var $e = $(e);
	// 2017-09-07
	// Unfortunately, I was forced to set it here manually,
	// otherwise the initial value will be displayed without its country flag.
	e.value = config.value;
	// 2017-09-06 https://github.com/jackocnr/intl-tel-input/blob/v12.0.2/README.md
	$e.intlTelInput(_.extend({
		// 2017-09-06
		// «Whether or not to allow the dropdown.
		// If disabled, there is no dropdown arrow, and the selected flag is not clickable.
		// Also we display the selected flag on the right instead because it is just a marker of state.»
		// Type: boolean. Default: `true`.
		allowDropdown: true
		// 2017-09-06
		// «If there is just a dial code in the input:
		// remove it on blur or submit, and re-add it on focus.
		// This is to prevent just a dial code getting submitted with the form.
		// Requires `nationalMode` to be set to `false`.»
		// Type: boolean. Default: `true`.
		,autoHideDialCode: true
		// 2017-09-06
		// «Set the input's placeholder to an example number for the selected country,
		// and update it if the country changes.
		// You can specify the number type using the `placeholderNumberType` option.
		// By default it is set to "polite",
		// which means it will only set the placeholder if the input doesn't already have one.
		// You can also set it to "aggressive", which will replace any existing placeholder, or "off".
		// Requires the `utilsScript` option.»
		// Type: string. Default: "polite".
		,autoPlaceholder: 'polite'
		// 2017-09-06
		// «Change the placeholder generated by autoPlaceholder. Must return a string.»
		// Type: function. Default: `null`.
		,customPlaceholder: null
		// 2017-09-07
		// «Expects a jQuery selector e.g. "body".
		// Instead of putting the country dropdown next to the input, append it to the element specified,
		// and it will then be positioned absolutely next to the input using JavaScript.
		// This is useful when the input is inside a container with overflow: hidden.
		// Note that the absolute positioning can be broken by scrolling,
		// so it will automatically close on the window scroll event.
		// If you have a different scrolling element that is causing problems,
		// simply listen for the scroll event on that element, and trigger $(window).scroll() e.g.»
		// Type: string. Default: "".
		,dropdownContainer: ''
		// 2017-09-07
		// «Don't display the countries you specify.»
		// Type: array. Default: `undefined`.
		,excludeCountries: []
		// 2017-09-07
		// «Format the input value (according to the nationalMode option)
		// during initialisation, and on setNumber.
		// Requires the `utilsScript` option.»
		// Type: boolean . Default: `true`.
		,formatOnDisplay: true
		// 2017-09-07
		// «When setting initialCountry to "auto",
		// you must use this option to specify a custom function that looks up the user's location.
		// Also note that when instantiating the plugin, we now return a deferred object,
		// so you can use .done(callback) to know when initialisation requests like this have completed.»
		// Type: function. Default: `null`.
		,geoIpLookup: function(callback) {
			// 2017-09-07
			// «Note that the callback must still be called in the event of an error,
			// hence the use of always in this example.
			// @todo Store the result in a cookie to avoid repeat lookups!»
			$.get('//ipinfo.io', function(){}, 'jsonp').always(function(resp) {
				var countryCode = (resp && resp.country) ? resp.country : '';
				callback(countryCode);
			});
		}
		// 2017-09-07
		// «Add a hidden input with the given name,
		// and on submit, populate it with the full international number (using getNumber).
		// This is a quick way for people using non-ajax forms
		// to get the full international number, even when `nationalMode` is enabled.
		// Note: requires the main telephone input to be inside a form element,
		// as this feature works by listening for the submit event on the closest form element.»
		// Type: string. Default: "".
		,hiddenInput: ''
		// 2017-09-07
		// «Set the initial country selection by specifying it's country code.
		// You can also set it to "auto", which will lookup the user's country based on their IP address
		// (requires the `geoIpLookup option`).
		// Note that the "auto" option will not update the country selection if the input already contains a number.
		// If you leave initialCountry blank, it will default to the first country in the list.»
		// Type: string. Default: "".
		,initialCountry: 'auto'
		// 2017-09-07
		// «Allow users to enter national numbers (and not have to think about international dial codes).
		// Formatting, validation and placeholders still work.
		// Then you can use getNumber to extract a full international number.
		// This option now defaults to `true`, and it is recommended that you leave it that way
		// as it provides a better experience for the user.»
		// Type: string. Default: "".
		,nationalMode: false
		// 2017-09-07
		// Note 1.
		// «Display only the countries you specify. See the example:
		// https://intl-tel-input.com/node_modules/intl-tel-input/examples/gen/only-countries-europe.html»
		// Type: array. Default: `undefined`.
		// Note 2.
		// The example above uses country codes in the lower case, but the upper case does work too:
		// I have verified it in practice.
		,onlyCountries: c.countries
		// 2017-09-07
		// «Specify the countries to appear at the top of the list.»
		// Type: array. Default: ["us", "gb"].
		,preferredCountries: []
		// 2017-09-07
		// «Display the country dial code next to the selected flag so it's not part of the typed number.
		// Note that this will disable `nationalMode`
		// because technically we are dealing with international numbers, but with the dial code separated.»
		// Type: boolean. Default: `false`.
		,separateDialCode: false
		// 2017-09-07
		// «Enable formatting/validation etc. by specifying the URL of the included utils.js script
		// (or alternatively just point it to the file on cdnjs.com).
		// The script is fetched using Ajax when the page has finished loading
		// (on the window.load event) to prevent blocking.
		// When instantiating the plugin, we return a deferred object,
		// so you can use .done(callback) to know when initialisation requests like this have finished.
		// See Utilities Script for more information:
		// https://github.com/jackocnr/intl-tel-input/blob/v12.0.2/README.md#utilities-script
		// Note that if you're lazy loading the plugin script itself (intlTelInput.js)
		// this will not work and you will need to use the loadUtils method instead.»
		// Type: string. Default: "".
		,utilsScript: ''
	}, config.options));
	$.fn.intlTelInput.loadUtils(c.utils);
	var $container = $e.closest('div.intl-tel-input');
	var eValid = $container.siblings('.df-valid');
	var eInvalid = $container.siblings('.df-invalid');
	var reset = function() {
		eInvalid.addClass('df-hidden');
		eValid.addClass('df-hidden');
	};
	$e.blur(function() {
		reset();
		if ($.trim($e.val())) {
			($e.intlTelInput('isValidNumber') ? eValid : eInvalid).removeClass('df-hidden');
		}
	});
	$e.on('change keyup', reset);
	ko.utils.registerEventHandler(e, 'change', function() {config.storage(this.value);});
}};});});