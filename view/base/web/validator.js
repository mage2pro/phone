define(['df', 'Df_Ui/validator', 'Df_Phone/lib/js/utils'], function(df, vr) {
	vr.add('phone', function(v) {
		// 2017-09-09
		// intlTelInputUtils.isValidNumber() accepts the Cyrillic letters
		// as valid phone number characters for a some reason :-(
		// E.g. intlTelInputUtils.isValidNumber('+552131398000ауувыа') returns `true`.
		// So I have implemented an additional validation to reject such obviously invalid cases.
		v = df.s.normalizePhone(v);
		return /^\+\d+$/.test(v) && intlTelInputUtils.isValidNumber(v);
	}, vr.peav('telephone number'));
});