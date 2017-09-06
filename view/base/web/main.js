// 2017-09-06
define([
	'df-lodash', 'jquery', 'ko', 'Df_Phone/lib/js/main'
], function (_, $, ko) {return (
/**
 * 2017-09-06
 * @param {Object} c
 * @param {String[]} c.countries
 * @param {String} c.utils
 */
function(c) {
	ko.bindingHandlers['df-phone'] = {
		init: function(e, accessor) {
			var config = accessor();
			var options = _.extend({
				geoIpLookup: function(callback) {
					$.get('//ipinfo.io', function(){}, 'jsonp').always(function(resp) {
						var countryCode = (resp && resp.country) ? resp.country : '';
						callback(countryCode);
					});
				}
				,initialCountry: 'auto'
				,nationalMode: false
				,onlyCountries: c.countries
				,preferredCountries: []
				,separateDialCode: false
				,utilsScript: c.utils
			}, config.options);
			var $e = $(e);
			$e.intlTelInput(options);
			$e.blur();
			ko.utils.registerEventHandler(e, 'change', function() {config.storage(this.value);});
		}
	};
});});