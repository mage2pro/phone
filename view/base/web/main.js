// 2017-09-06
define([
	'df-lodash', 'jquery', 'ko', 'Df_Phone/lib/js/main'
], function (_, $, ko) {ko.bindingHandlers['df-phone'] = {
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
			,onlyCountries: config.countries
			,preferredCountries: []
			,separateDialCode: false
			,utilsScript: config.utils
		}, config.options);
		var $e = $(e);
		$e.intlTelInput(options);
		$e.blur();
		ko.utils.registerEventHandler(e, 'change', function() {config.storage(this.value);});
	}
};});