<?php
use libphonenumber\NumberParseException as lE;
use libphonenumber\PhoneNumberUtil as lParser;
use libphonenumber\PhoneNumber as lPhone;
use libphonenumber\PhoneNumberFormat as lFormat;
use Magento\Customer\Model\Address as CA;
use Magento\Quote\Model\Quote\Address as QA;
use Magento\Sales\Model\Order\Address as OA;
/**
 * 2017-04-22 https://github.com/giggsey/libphonenumber-for-php#quick-examples
 * @used-by df_phone_format()
 * @used-by \Dfe\CheckoutCom\Charge::cPhone()
 * @param lPhone|string[]|OA|QA|CA $n
 * @param Closure|bool|mixed $onE [optional]
 * @return lPhone|null
 * @throws lE
 */
function df_phone($n, $onE = true) {return df_try(function() use($n) {return $n instanceof lPhone ? $n : (
	df_phone_p()->parse(...(!df_is_address($n) ? $n : [$n->getTelephone(), $n->getCountryId()])
));}, $onE);}

/**
 * 2017-04-22 «+79629197300» => «962»
 * @param string[]|OA|QA|CA $n
 * @param bool $throw [optional]
 * @return string|null
 */
function df_phone_area($n, $throw = true) {return dfa(df_phone_explode($n, $throw), 1);}

/**
 * 2017-04-22 «+79629197300» => 7
 * @param string[]|OA|QA|CA $n
 * @param bool $throw [optional]
 * @return int|null
 */
function df_phone_country_code($n, $throw = true) {return df_phone($n, $throw)->getCountryCode();}

/**
 * 2017-04-22 «+7 962 919-73-00» => [«7», «962», «9197300»]
 * @used-by df_phone_area()
 * @used-by dfe_moip_phone()
 * @param string[]|OA|QA|CA $n
 * @param Closure|bool|mixed $onE [optional]
 * @return string[]
 */
function df_phone_explode($n, $onE = true) {return df_explode_space(df_string_clean(df_phone_format_int(
	$n, $onE
), '+', '-'));}

/**
 * 2017-04-22
 * INTERNATIONAL and NATIONAL formats are consistent with the definition in ITU-T Recommendation
 * E123. For example, the number of the Google Switzerland office will be written as
 * "+41 44 668 1800" in INTERNATIONAL format, and as "044 668 1800" in NATIONAL format.
 * E164 format is as per INTERNATIONAL format but with no formatting applied, e.g.
 * "+41446681800". RFC3966 is as per INTERNATIONAL format, but with all spaces and other
 * separating symbols replaced with a hyphen, and with any phone number extension appended with
 * ";ext=". It also will have a prefix of "tel:" added, e.g. "tel:+41-44-668-1800".
 * @used-by df_phone_format_clean()
 * @used-by df_phone_format_int()
 * @param string[]|OA|QA|CA $n
 * @param Closure|bool|mixed $onE
 * @param int $f
 * @return string
 */
function df_phone_format($n, $onE, $f) {return df_phone_p()->format(df_phone($n, $onE), $f);}

/**
 * 2017-04-22 «+79629197300»
 * 2017-10-22
 * @see df.s.normalizePhone():
 * https://github.com/mage2pro/core/blob/3.2.15/Core/view/base/web/my/string.js#L64-L72 
 * @used-by \Dfe\Sift\Payload\Address::p()
 * @used-by \Dfe\Stripe\Block\Multishipping::pPhone()
 * @param string[]|OA|QA|CA $n
 * @param Closure|bool|mixed $onE [optional]
 * @return string
 */
function df_phone_format_clean($n, $onE = true) {return df_phone_format($n, $onE, lFormat::E164);}

/**
 * 2017-04-22 «+7 962 919-73-00»
 * @used-by df_phone_explode()
 * @param string[]|OA|QA|CA $n
 * @param Closure|bool|mixed $onE [optional]
 * @return string
 */
function df_phone_format_int($n, $onE = true) {return df_phone_format($n, $onE, lFormat::INTERNATIONAL);}

/**
 * 2017-04-22
 * @used-by df_phone()
 * @used-by df_phone_format()
 * @return lParser
 */
function df_phone_p() {return lParser::getInstance();};