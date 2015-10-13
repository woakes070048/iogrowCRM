/**
 * Created by Ghiboub khalid on 9/29/15.
 */

app.controller('RegionalEditCtrl', ['$scope', 'Auth', 'User', 'Map',
    function ($scope, Auth, User, Map) {
        var LANGUAGE_BY_LOCALE;
        $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Regional").addClass("active");
        $scope.languages = {'en': 'English', 'fr': 'French', 'ar': 'Arabic'};
        $scope.getCurrencyFormat = function (country_code) {
            return new Intl.NumberFormat(country_code).format(1234567.85)
        };

        $scope.languagesCodes = {

            'af-NA': "Afrikaans (Namibia)",
            'af-ZA': "Afrikaans (South Africa)",
            'af': "Afrikaans",
            'ak-GH': "Akan (Ghana)",
            'ak': "Akan",
            'sq-AL': 'Albanian (Albania)',
            'sq': "Albanian",
            'am-ET': "Amharic (Ethiopia)",
            'am': "Amharic",
            'fr': " Algeria",
            'ar-BH': "Arabic (Bahrain)",
            'ar-EG': "Arabic (Egypt)",
            'ar-IQ': "Arabic (Iraq)",
            'ar-JO': "Arabic (Jordan)",
            'ar-KW': "Arabic (Kuwait)",
            'ar-LB': "Arabic (Lebanon)",
            'ar-LY': "Arabic (Libya)",
            'fr': "Morocco",
            'ar-OM': "Arabic (Oman)",
            'ar-QA': "Arabic (Qatar)",
            'ar-SA': "Arabic (Saudi Arabia)",
            'ar-SD': "Arabic (Sudan)",
            'ar-SY': "Arabic (Syria)",
            'fr': "Tunisia",
            'ar-AE': "Arabic (United Arab Emirates)",
            'ar-YE': "Arabic (Yemen)",
            'ar': "Arabic",
            'hy-AM': "Armenian (Armenia)",
            'hy': "Armenian",
            'as-IN': "Assamese (India)",
            'as': "Assamese",
            'asa-TZ': "Asu (Tanzania)",
            'asa': "Asu",
            'az-Cyrl': "Azerbaijani (Cyrillic)",
            'az-Cyrl-AZ': "Azerbaijani (Cyrillic, Azerbaijan)",
            'az-Latn': "Azerbaijani (Latin)",
            'az-Latn-AZ': "Azerbaijani (Latin, Azerbaijan)",
            'az': "Azerbaijani",
            'bm-ML': "Bambara (Mali)",
            'bm': "Bambara",
            'eu-ES': "Basque (Spain)",
            'eu': "Basque",
            'be-BY': "Belarusian (Belarus)",
            'be': "Belarusian",
            'bem-ZM': "Bemba (Zambia)",
            'bem': "Bemba",
            'bez-TZ': "Bena (Tanzania)",
            'bez': "Bena",
            'bn-BD': "Bengali (Bangladesh)",
            'bn-IN': "Bengali (India)",
            'bn': "Bengali",
            'bs-BA': "Bosnian (Bosnia and Herzegovina)",
            'bs': "Bosnian",
            'bg-BG': "Bulgarian (Bulgaria)",
            'bg': "Bulgarian",
            'my-MM': "Burmese (Myanmar [Burma])",
            'my': "Burmese",
            'ca-ES': "Catalan (Spain)",
            'ca': "Catalan",
            'tzm-Latn': "Central Morocco Tamazight (Latin)",
            'tzm-Latn-MA': "Central Morocco Tamazight (Latin, Morocco)",
            'tzm': "Central Morocco Tamazight",
            'chr-US': "Cherokee (United States)",
            'chr': "Cherokee",
            'cgg-UG': "Chiga (Uganda)",
            'cgg': "Chiga",
            'zh-Hans': "Chinese (Simplified Han)",
            'zh-Hans-CN': "Chinese (Simplified Han, China)",
            'zh-Hans-HK': "Chinese (Simplified Han, Hong Kong SAR China)",
            'zh-Hans-MO': "Chinese (Simplified Han, Macau SAR China)",
            'zh-Hans-SG': "Chinese (Simplified Han, Singapore)",
            'zh-Hant': "Chinese (Traditional Han)",
            'zh-Hant-HK': "Chinese (Traditional Han, Hong Kong SAR China)",
            'zh-Hant-MO': "Chinese (Traditional Han, Macau SAR China)",
            'zh-Hant-TW': "Chinese (Traditional Han, Taiwan)",
            'zh': "Chinese",
            'kw-GB': "Cornish (United Kingdom)",
            'kw': "Cornish",
            'hr-HR': "Croatian (Croatia)",
            'hr': "Croatian",
            'cs-CZ': "Czech (Czech Republic)",
            'cs': "Czech",
            'da-DK': "Danish (Denmark)",
            'da': "Danish",
            'nl-BE': "Dutch (Belgium)",
            'nl-NL': "Dutch (Netherlands)",
            'nl': "Dutch",
            'ebu-KE': "Embu (Kenya)",
            'ebu': "Embu",
            'en-AS': "English (American Samoa)",
            'en-AU': "English (Australia)",
            'en-BE': "English (Belgium)",
            'en-BZ': "English (Belize)",
            'en-BW': "English (Botswana)",
            'en-CA': "English (Canada)",
            'en-GU': "English (Guam)",
            'en-HK': "English (Hong Kong SAR China)",
            'en-IN': "English (India)",
            'en-IE': "English (Ireland)",
            'en-JM': "English (Jamaica)",
            'en-MT': "English (Malta)",
            'en-MH': "English (Marshall Islands)",
            'en-MU': "English (Mauritius)",
            'en-NA': "English (Namibia)",
            'en-NZ': "English (New Zealand)",
            'en-MP': "English (Northern Mariana Islands)",
            'en-PK': "English (Pakistan)",
            'en-PH': "English (Philippines)",
            'en-SG': "English (Singapore)",
            'en-ZA': "English (South Africa)",
            'en-TT': "English (Trinidad and Tobago)",
            'en-UM': "English (U.S. Minor Outlying Islands)",
            'en-VI': "English (U.S. Virgin Islands)",
            'en-GB': "English (United Kingdom)",
            'en-US': "English (United States)",
            'en-ZW': "English (Zimbabwe)",
            'en': "English",
            'eo': "Esperanto",
            'et-EE': "Estonian (Estonia)",
            'et': "Estonian",
            'ee-GH': "Ewe (Ghana)",
            'ee-TG': "Ewe (Togo)",
            'ee': "Ewe",
            'fo-FO': "Faroese (Faroe Islands)",
            'fo': "Faroese",
            'fil-PH': "Filipino (Philippines)",
            'fil': "Filipino",
            'fi-FI': "Finnish (Finland)",
            'fi': "Finnish",
            'fr-BE': "French (Belgium)",
            'fr-BJ': "French (Benin)",
            'fr-BF': "French (Burkina Faso)",
            'fr-BI': "French (Burundi)",
            'fr-CM': "French (Cameroon)",
            'fr-CA': "French (Canada)",
            'fr-CF': "French (Central African Republic)",
            'fr-TD': "French (Chad)",
            'fr-KM': "French (Comoros)",
            'fr-CG': "French (Congo - Brazzaville)",
            'fr-CD': "French (Congo - Kinshasa)",
            'fr-CI': "French (Côte d’Ivoire)",
            'fr-DJ': "French (Djibouti)",
            'fr-GQ': "French (Equatorial Guinea)",
            'fr-FR': "French (France)",
            'fr-GA': "French (Gabon)",
            'fr-GP': "French (Guadeloupe)",
            'fr-GN': "French (Guinea)",
            'fr-LU': "French (Luxembourg)",
            'fr-MG': "French (Madagascar)",
            'fr-ML': "French (Mali)",
            'fr-MQ': "French (Martinique)",
            'fr-MC': "French (Monaco)",
            'fr-NE': "French (Niger)",
            'fr-RW': "French (Rwanda)",
            'fr-RE': "French (Réunion)",
            'fr-BL': "French (Saint Barthélemy)",
            'fr-MF': "French (Saint Martin)",
            'fr-SN': "French (Senegal)",
            'fr-CH': "French (Switzerland)",
            'fr-TG': "French (Togo)",
            'fr': "French",
            'ff-SN': "Fulah (Senegal)",
            'ff': "Fulah",
            'gl-ES': "Galician (Spain)",
            'gl': "Galician",
            'lg-UG': "Ganda (Uganda)",
            'lg': "Ganda",
            'ka-GE': "Georgian (Georgia)",
            'ka': "Georgian",
            'de-AT': "German (Austria)",
            'de-BE': "German (Belgium)",
            'de-DE': "German (Germany)",
            'de-LI': "German (Liechtenstein)",
            'de-LU': "German (Luxembourg)",
            'de-CH': "German (Switzerland)",
            'de': "German",
            'el-CY': "Greek (Cyprus)",
            'el-GR': "Greek (Greece)",
            'el': "Greek",
            'gu-IN': "Gujarati (India)",
            'gu': "Gujarati",
            'guz-KE': "Gusii (Kenya)",
            'guz': "Gusii",
            'ha-Latn': "Hausa (Latin)",
            'ha-Latn-GH': "Hausa (Latin, Ghana)",
            'ha-Latn-NE': "Hausa (Latin, Niger)",
            'ha-Latn-NG': "Hausa (Latin, Nigeria)",
            'ha': "Hausa",
            'haw-US': "Hawaiian (United States)",
            'haw': "Hawaiian",
            'he-IL': "Hebrew (Israel)",
            'he': "Hebrew",
            'hi-IN': "Hindi (India)",
            'hi': "Hindi",
            'hu-HU': "Hungarian (Hungary)",
            'hu': "Hungarian",
            'is-IS': "Icelandic (Iceland)",
            'is': "Icelandic",
            'ig-NG': "Igbo (Nigeria)",
            'ig': "Igbo",
            'id-ID': "Indonesian (Indonesia)",
            'id': "Indonesian",
            'ga-IE': "Irish (Ireland)",
            'ga': "Irish",
            'it-IT': "Italian (Italy)",
            'it-CH': "Italian (Switzerland)",
            'it': "Italian",
            'ja-JP': "Japanese (Japan)",
            'ja': "Japanese",
            'kea-CV': "Kabuverdianu (Cape Verde)",
            'kea': "Kabuverdianu",
            'kl-GL': "Kalaallisut (Greenland)",
            'kl': "Kalaallisut",
            'kln-KE': "Kalenjin (Kenya)",
            'kln': "Kalenjin",
            'kam-KE': "Kamba (Kenya)",
            'kam': "Kamba",
            'kn-IN': "Kannada (India)",
            'kn': "Kannada",
            'kk-Cyrl': "Kazakh (Cyrillic)",
            'kk-Cyrl-KZ': "Kazakh (Cyrillic, Kazakhstan)",
            'kk': "Kazakh",
            'km-KH': "Khmer (Cambodia)",
            'km': "Khmer",
            'ki-KE': "Kikuyu (Kenya)",
            'ki': "Kikuyu",
            'rw-RW': "Kinyarwanda (Rwanda)",
            'rw': "Kinyarwanda",
            'kok-IN': "Konkani (India)",
            'kok': "Konkani",
            'ko-KR': "Korean (South Korea)",
            'ko': "Korean",
            'khq-ML': "Koyra Chiini (Mali)",
            'khq': "Koyra Chiini",
            'ses-ML': "Koyraboro Senni (Mali)",
            'ses': "Koyraboro Senni",
            'lag-TZ': "Langi (Tanzania)",
            'lag': "Langi",
            'lv-LV': "Latvian (Latvia)",
            'lv': "Latvian",
            'lt-LT': "Lithuanian (Lithuania)",
            'lt': "Lithuanian",
            'luo-KE': "Luo (Kenya)",
            'luo': "Luo",
            'luy-KE': "Luyia (Kenya)",
            'luy': "Luyia",
            'mk-MK': "Macedonian (Macedonia)",
            'mk': "Macedonian",
            'jmc-TZ': "Machame (Tanzania)",
            'jmc': "Machame",
            'kde-TZ': "Makonde (Tanzania)",
            'kde': "Makonde",
            'mg-MG': "Malagasy (Madagascar)",
            'mg': "Malagasy",
            'ms-BN': "Malay (Brunei)",
            'ms-MY': "Malay (Malaysia)",
            'ms': "Malay",
            'ml-IN': "Malayalam (India)",
            'ml': "Malayalam",
            'mt-MT': "Maltese (Malta)",
            'mt': "Maltese",
            'gv-GB': "Manx (United Kingdom)",
            'gv': "Manx",
            'mr-IN': "Marathi (India)",
            'mr': "Marathi",
            'mas-KE': "Masai (Kenya)",
            'mas-TZ': "Masai (Tanzania)",
            'mas': "Masai",
            'mer-KE': "Meru (Kenya)",
            'mer': "Meru",
            'mfe-MU': "Morisyen (Mauritius)",
            'mfe': "Morisyen",
            'naq-NA': "Nama (Namibia)",
            'naq': "Nama",
            'ne-IN': "Nepali (India)",
            'ne-NP': "Nepali (Nepal)",
            'ne': "Nepali",
            'nd-ZW': "North Ndebele (Zimbabwe)",
            'nd': "North Ndebele",
            'nb-NO': "Norwegian Bokmål (Norway)",
            'nb': "Norwegian Bokmål",
            'nn-NO': "Norwegian Nynorsk (Norway)",
            'nn': "Norwegian Nynorsk",
            'nyn-UG': "Nyankole (Uganda)",
            'nyn': "Nyankole",
            'or-IN': "Oriya (India)",
            'or': "Oriya",
            'om-ET': "Oromo (Ethiopia)",
            'om-KE': "Oromo (Kenya)",
            'om': "Oromo",
            'ps-AF': "Pashto (Afghanistan)",
            'ps': "Pashto",
            'fa-AF': "Persian (Afghanistan)",
            'fa-IR': "Persian (Iran)",
            'fa': "Persian",
            'pl-PL': "Polish (Poland)",
            'pl': "Polish",
            'pt-BR': "Portuguese (Brazil)",
            'pt-GW': "Portuguese (Guinea-Bissau)",
            'pt-MZ': "Portuguese (Mozambique)",
            'pt-PT': "Portuguese (Portugal)",
            'pt': "Portuguese",
            'pa-Arab': "Punjabi (Arabic)",
            'pa-Arab-PK': "Punjabi (Arabic, Pakistan)",
            'pa-Guru': "Punjabi (Gurmukhi)",
            'pa-Guru-IN': "Punjabi (Gurmukhi, India)",
            'pa': "Punjabi",
            'ro-MD': "Romanian (Moldova)",
            'ro-RO': "Romanian (Romania)",
            'ro': "Romanian",
            'rm-CH': "Romansh (Switzerland)",
            'rm': "Romansh",
            'rof-TZ': "Rombo (Tanzania)",
            'rof': "Rombo",
            'ru-MD': "Russian (Moldova)",
            'ru-RU': "Russian (Russia)",
            'ru-UA': "Russian (Ukraine)",
            'ru': "Russian",
            'rwk-TZ': "Rwa (Tanzania)",
            'rwk': "Rwa",
            'saq-KE': "Samburu (Kenya)",
            'saq': "Samburu",
            'sg-CF': "Sango (Central African Republic)",
            'sg': "Sango",
            'seh-MZ': "Sena (Mozambique)",
            'seh': "Sena",
            'sr-Cyrl': "Serbian (Cyrillic)",
            'sr-Cyrl-BA': "Serbian (Cyrillic, Bosnia and Herzegovina)",
            'sr-Cyrl-ME': "Serbian (Cyrillic, Montenegro)",
            'sr-Cyrl-RS': "Serbian (Cyrillic, Serbia)",
            'sr-Latn': "Serbian (Latin)",
            'sr-Latn-BA': "Serbian (Latin, Bosnia and Herzegovina)",
            'sr-Latn-ME': "Serbian (Latin, Montenegro)",
            'sr-Latn-RS': "Serbian (Latin, Serbia)",
            'sr': "Serbian",
            'sn-ZW': "Shona (Zimbabwe)",
            'sn': "Shona",
            'ii-CN': "Sichuan Yi (China)",
            'ii': "Sichuan Yi",
            'si-LK': "Sinhala (Sri Lanka)",
            'si': "Sinhala",
            'sk-SK': "Slovak (Slovakia)",
            'sk': "Slovak",
            'sl-SI': "Slovenian (Slovenia)",
            'sl': "Slovenian",
            'xog-UG': "Soga (Uganda)",
            'xog': "Soga",
            'so-DJ': "Somali (Djibouti)",
            'so-ET': "Somali (Ethiopia)",
            'so-KE': "Somali (Kenya)",
            'so-SO': "Somali (Somalia)",
            'so': "Somali",
            'es-AR': "Spanish (Argentina)",
            'es-BO': "Spanish (Bolivia)",
            'es-CL': "Spanish (Chile)",
            'es-CO': "Spanish (Colombia)",
            'es-CR': "Spanish (Costa Rica)",
            'es-DO': "Spanish (Dominican Republic)",
            'es-EC': "Spanish (Ecuador)",
            'es-SV': "Spanish (El Salvador)",
            'es-GQ': "Spanish (Equatorial Guinea)",
            'es-GT': "Spanish (Guatemala)",
            'es-HN': "Spanish (Honduras)",
            'es-419': "Spanish (Latin America)",
            'es-MX': "Spanish (Mexico)",
            'es-NI': "Spanish (Nicaragua)",
            'es-PA': "Spanish (Panama)",
            'es-PY': "Spanish (Paraguay)",
            'es-PE': "Spanish (Peru)",
            'es-PR': "Spanish (Puerto Rico)",
            'es-ES': "Spanish (Spain)",
            'es-US': "Spanish (United States)",
            'es-UY': "Spanish (Uruguay)",
            'es-VE': "Spanish (Venezuela)",
            'es': "Spanish",
            'sw-KE': "Swahili (Kenya)",
            'sw-TZ': "Swahili (Tanzania)",
            'sw': "Swahili",
            'sv-FI': "Swedish (Finland)",
            'sv-SE': "Swedish (Sweden)",
            'sv': "Swedish",
            'gsw-CH': "Swiss German (Switzerland)",
            'gsw': "Swiss German",
            'shi-Latn': "Tachelhit (Latin)",
            'shi-Latn-MA': "Tachelhit (Latin, Morocco)",
            'shi-Tfng': "Tachelhit (Tifinagh)",
            'shi-Tfng-MA': "Tachelhit (Tifinagh, Morocco)",
            'shi': "Tachelhit",
            'dav-KE': "Taita (Kenya)",
            'dav': "Taita",
            'ta-IN': "Tamil (India)",
            'ta-LK': "Tamil (Sri Lanka)",
            'ta': "Tamil",
            'te-IN': "Telugu (India)",
            'te': "Telugu",
            'teo-KE': "Teso (Kenya)",
            'teo-UG': "Teso (Uganda)",
            'teo': "Teso",
            'th-TH': "Thai (Thailand)",
            'th': "Thai",
            'bo-CN': "Tibetan (China)",
            'bo-IN': "Tibetan (India)",
            'bo': "Tibetan",
            'ti-ER': "Tigrinya (Eritrea)",
            'ti-ET': "Tigrinya (Ethiopia)",
            'ti': "Tigrinya",
            'to-TO': "Tonga (Tonga)",
            'to': "Tonga",
            'tr-TR': "Turkish (Turkey)",
            'tr': "Turkish",
            'uk-UA': "Ukrainian (Ukraine)",
            'uk': "Ukrainian",
            'ur-IN': "Urdu (India)",
            'ur-PK': "Urdu (Pakistan)",
            'ur': "Urdu",
            'uz-Arab': "Uzbek (Arabic)",
            'uz-Arab-AF': "Uzbek (Arabic, Afghanistan)",
            'uz-Cyrl': "Uzbek (Cyrillic)",
            'uz-Cyrl-UZ': "Uzbek (Cyrillic, Uzbekistan)",
            'uz-Latn': "Uzbek (Latin)",
            'uz-Latn-UZ': "Uzbek (Latin, Uzbekistan)",
            'uz': "Uzbek",
            'vi-VN': "Vietnamese (Vietnam)",
            'vi': "Vietnamese",
            'vun-TZ': "Vunjo (Tanzania)",
            'vun': "Vunjo",
            'cy-GB': "Welsh (United Kingdom)",
            'cy': "Welsh",
            'yo-NG': "Yoruba (Nigeria)",
            'yo': "Yoruba",
            'zu-ZA': "Zulu (South Africa)",
            'zu': "Zulu"
        };
        $scope.contriesCodes = [
            {name: 'Afghanistan', code: 'AF'},
            {name: 'Åland Islands', code: 'AX'},
            {name: 'Albania', code: 'AL'},
            {name: 'Algeria', code: 'DZ'},
            {name: 'American Samoa', code: 'AS'},
            {name: 'AndorrA', code: 'AD'},
            {name: 'Angola', code: 'AO'},
            {name: 'Anguilla', code: 'AI'},
            {name: 'Antarctica', code: 'AQ'},
            {name: 'Antigua and Barbuda', code: 'AG'},
            {name: 'Argentina', code: 'AR'},
            {name: 'Armenia', code: 'AM'},
            {name: 'Aruba', code: 'AW'},
            {name: 'Australia', code: 'AU'},
            {name: 'Austria', code: 'AT'},
            {name: 'Azerbaijan', code: 'AZ'},
            {name: 'Bahamas', code: 'BS'},
            {name: 'Bahrain', code: 'BH'},
            {name: 'Bangladesh', code: 'BD'},
            {name: 'Barbados', code: 'BB'},
            {name: 'Belarus', code: 'BY'},
            {name: 'Belgium', code: 'BE'},
            {name: 'Belize', code: 'BZ'},
            {name: 'Benin', code: 'BJ'},
            {name: 'Bermuda', code: 'BM'},
            {name: 'Bhutan', code: 'BT'},
            {name: 'Bolivia', code: 'BO'},
            {name: 'Bosnia and Herzegovina', code: 'BA'},
            {name: 'Botswana', code: 'BW'},
            {name: 'Bouvet Island', code: 'BV'},
            {name: 'Brazil', code: 'BR'},
            {name: 'British Indian Ocean Territory', code: 'IO'},
            {name: 'Brunei Darussalam', code: 'BN'},
            {name: 'Bulgaria', code: 'BG'},
            {name: 'Burkina Faso', code: 'BF'},
            {name: 'Burundi', code: 'BI'},
            {name: 'Cambodia', code: 'KH'},
            {name: 'Cameroon', code: 'CM'},
            {name: 'Canada', code: 'CA'},
            {name: 'Cape Verde', code: 'CV'},
            {name: 'Cayman Islands', code: 'KY'},
            {name: 'Central African Republic', code: 'CF'},
            {name: 'Chad', code: 'TD'},
            {name: 'Chile', code: 'CL'},
            {name: 'China', code: 'CN'},
            {name: 'Christmas Island', code: 'CX'},
            {name: 'Cocos (Keeling) Islands', code: 'CC'},
            {name: 'Colombia', code: 'CO'},
            {name: 'Comoros', code: 'KM'},
            {name: 'Congo', code: 'CG'},
            {name: 'Congo, The Democratic Republic of the', code: 'CD'},
            {name: 'Cook Islands', code: 'CK'},
            {name: 'Costa Rica', code: 'CR'},
            {name: 'Cote D\'Ivoire', code: 'CI'},
            {name: 'Croatia', code: 'HR'},
            {name: 'Cuba', code: 'CU'},
            {name: 'Cyprus', code: 'CY'},
            {name: 'Czech Republic', code: 'CZ'},
            {name: 'Denmark', code: 'DK'},
            {name: 'Djibouti', code: 'DJ'},
            {name: 'Dominica', code: 'DM'},
            {name: 'Dominican Republic', code: 'DO'},
            {name: 'Ecuador', code: 'EC'},
            {name: 'Egypt', code: 'EG'},
            {name: 'El Salvador', code: 'SV'},
            {name: 'Equatorial Guinea', code: 'GQ'},
            {name: 'Eritrea', code: 'ER'},
            {name: 'Estonia', code: 'EE'},
            {name: 'Ethiopia', code: 'ET'},
            {name: 'Falkland Islands (Malvinas)', code: 'FK'},
            {name: 'Faroe Islands', code: 'FO'},
            {name: 'Fiji', code: 'FJ'},
            {name: 'Finland', code: 'FI'},
            {name: 'France', code: 'FR'},
            {name: 'French Guiana', code: 'GF'},
            {name: 'French Polynesia', code: 'PF'},
            {name: 'French Southern Territories', code: 'TF'},
            {name: 'Gabon', code: 'GA'},
            {name: 'Gambia', code: 'GM'},
            {name: 'Georgia', code: 'GE'},
            {name: 'Germany', code: 'DE'},
            {name: 'Ghana', code: 'GH'},
            {name: 'Gibraltar', code: 'GI'},
            {name: 'Greece', code: 'GR'},
            {name: 'Greenland', code: 'GL'},
            {name: 'Grenada', code: 'GD'},
            {name: 'Guadeloupe', code: 'GP'},
            {name: 'Guam', code: 'GU'},
            {name: 'Guatemala', code: 'GT'},
            {name: 'Guernsey', code: 'GG'},
            {name: 'Guinea', code: 'GN'},
            {name: 'Guinea-Bissau', code: 'GW'},
            {name: 'Guyana', code: 'GY'},
            {name: 'Haiti', code: 'HT'},
            {name: 'Heard Island and Mcdonald Islands', code: 'HM'},
            {name: 'Holy See (Vatican City State)', code: 'VA'},
            {name: 'Honduras', code: 'HN'},
            {name: 'Hong Kong', code: 'HK'},
            {name: 'Hungary', code: 'HU'},
            {name: 'Iceland', code: 'IS'},
            {name: 'India', code: 'IN'},
            {name: 'Indonesia', code: 'ID'},
            {name: 'Iran, Islamic Republic Of', code: 'IR'},
            {name: 'Iraq', code: 'IQ'},
            {name: 'Ireland', code: 'IE'},
            {name: 'Isle of Man', code: 'IM'},
            {name: 'Israel', code: 'IL'},
            {name: 'Italy', code: 'IT'},
            {name: 'Jamaica', code: 'JM'},
            {name: 'Japan', code: 'JP'},
            {name: 'Jersey', code: 'JE'},
            {name: 'Jordan', code: 'JO'},
            {name: 'Kazakhstan', code: 'KZ'},
            {name: 'Kenya', code: 'KE'},
            {name: 'Kiribati', code: 'KI'},
            {name: 'Korea, Democratic People\'S Republic of', code: 'KP'},
            {name: 'Korea, Republic of', code: 'KR'},
            {name: 'Kuwait', code: 'KW'},
            {name: 'Kyrgyzstan', code: 'KG'},
            {name: 'Lao People\'S Democratic Republic', code: 'LA'},
            {name: 'Latvia', code: 'LV'},
            {name: 'Lebanon', code: 'LB'},
            {name: 'Lesotho', code: 'LS'},
            {name: 'Liberia', code: 'LR'},
            {name: 'Libyan Arab Jamahiriya', code: 'LY'},
            {name: 'Liechtenstein', code: 'LI'},
            {name: 'Lithuania', code: 'LT'},
            {name: 'Luxembourg', code: 'LU'},
            {name: 'Macao', code: 'MO'},
            {name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK'},
            {name: 'Madagascar', code: 'MG'},
            {name: 'Malawi', code: 'MW'},
            {name: 'Malaysia', code: 'MY'},
            {name: 'Maldives', code: 'MV'},
            {name: 'Mali', code: 'ML'},
            {name: 'Malta', code: 'MT'},
            {name: 'Marshall Islands', code: 'MH'},
            {name: 'Martinique', code: 'MQ'},
            {name: 'Mauritania', code: 'MR'},
            {name: 'Mauritius', code: 'MU'},
            {name: 'Mayotte', code: 'YT'},
            {name: 'Mexico', code: 'MX'},
            {name: 'Micronesia, Federated States of', code: 'FM'},
            {name: 'Moldova, Republic of', code: 'MD'},
            {name: 'Monaco', code: 'MC'},
            {name: 'Mongolia', code: 'MN'},
            {name: 'Montserrat', code: 'MS'},
            {name: 'Morocco', code: 'MA'},
            {name: 'Mozambique', code: 'MZ'},
            {name: 'Myanmar', code: 'MM'},
            {name: 'Namibia', code: 'NA'},
            {name: 'Nauru', code: 'NR'},
            {name: 'Nepal', code: 'NP'},
            {name: 'Netherlands', code: 'NL'},
            {name: 'Netherlands Antilles', code: 'AN'},
            {name: 'New Caledonia', code: 'NC'},
            {name: 'New Zealand', code: 'NZ'},
            {name: 'Nicaragua', code: 'NI'},
            {name: 'Niger', code: 'NE'},
            {name: 'Nigeria', code: 'NG'},
            {name: 'Niue', code: 'NU'},
            {name: 'Norfolk Island', code: 'NF'},
            {name: 'Northern Mariana Islands', code: 'MP'},
            {name: 'Norway', code: 'NO'},
            {name: 'Oman', code: 'OM'},
            {name: 'Pakistan', code: 'PK'},
            {name: 'Palau', code: 'PW'},
            {name: 'Palestinian Territory, Occupied', code: 'PS'},
            {name: 'Panama', code: 'PA'},
            {name: 'Papua New Guinea', code: 'PG'},
            {name: 'Paraguay', code: 'PY'},
            {name: 'Peru', code: 'PE'},
            {name: 'Philippines', code: 'PH'},
            {name: 'Pitcairn', code: 'PN'},
            {name: 'Poland', code: 'PL'},
            {name: 'Portugal', code: 'PT'},
            {name: 'Puerto Rico', code: 'PR'},
            {name: 'Qatar', code: 'QA'},
            {name: 'Reunion', code: 'RE'},
            {name: 'Romania', code: 'RO'},
            {name: 'Russian Federation', code: 'RU'},
            {name: 'RWANDA', code: 'RW'},
            {name: 'Saint Helena', code: 'SH'},
            {name: 'Saint Kitts and Nevis', code: 'KN'},
            {name: 'Saint Lucia', code: 'LC'},
            {name: 'Saint Pierre and Miquelon', code: 'PM'},
            {name: 'Saint Vincent and the Grenadines', code: 'VC'},
            {name: 'Samoa', code: 'WS'},
            {name: 'San Marino', code: 'SM'},
            {name: 'Sao Tome and Principe', code: 'ST'},
            {name: 'Saudi Arabia', code: 'SA'},
            {name: 'Senegal', code: 'SN'},
            {name: 'Serbia and Montenegro', code: 'CS'},
            {name: 'Seychelles', code: 'SC'},
            {name: 'Sierra Leone', code: 'SL'},
            {name: 'Singapore', code: 'SG'},
            {name: 'Slovakia', code: 'SK'},
            {name: 'Slovenia', code: 'SI'},
            {name: 'Solomon Islands', code: 'SB'},
            {name: 'Somalia', code: 'SO'},
            {name: 'South Africa', code: 'ZA'},
            {name: 'South Georgia and the South Sandwich Islands', code: 'GS'},
            {name: 'Spain', code: 'ES'},
            {name: 'Sri Lanka', code: 'LK'},
            {name: 'Sudan', code: 'SD'},
            {name: 'Suriname', code: 'SR'},
            {name: 'Svalbard and Jan Mayen', code: 'SJ'},
            {name: 'Swaziland', code: 'SZ'},
            {name: 'Sweden', code: 'SE'},
            {name: 'Switzerland', code: 'CH'},
            {name: 'Syrian Arab Republic', code: 'SY'},
            {name: 'Taiwan, Province of China', code: 'TW'},
            {name: 'Tajikistan', code: 'TJ'},
            {name: 'Tanzania, United Republic of', code: 'TZ'},
            {name: 'Thailand', code: 'TH'},
            {name: 'Timor-Leste', code: 'TL'},
            {name: 'Togo', code: 'TG'},
            {name: 'Tokelau', code: 'TK'},
            {name: 'Tonga', code: 'TO'},
            {name: 'Trinidad and Tobago', code: 'TT'},
            {name: 'Tunisia', code: 'TN'},
            {name: 'Turkey', code: 'TR'},
            {name: 'Turkmenistan', code: 'TM'},
            {name: 'Turks and Caicos Islands', code: 'TC'},
            {name: 'Tuvalu', code: 'TV'},
            {name: 'Uganda', code: 'UG'},
            {name: 'Ukraine', code: 'UA'},
            {name: 'United Arab Emirates', code: 'AE'},
            {name: 'United Kingdom', code: 'GB'},
            {name: 'United States', code: 'US'},
            {name: 'United States Minor Outlying Islands', code: 'UM'},
            {name: 'Uruguay', code: 'UY'},
            {name: 'Uzbekistan', code: 'UZ'},
            {name: 'Vanuatu', code: 'VU'},
            {name: 'Venezuela', code: 'VE'},
            {name: 'Viet Nam', code: 'VN'},
            {name: 'Virgin Islands, British', code: 'VG'},
            {name: 'Virgin Islands, U.S.', code: 'VI'},
            {name: 'Wallis and Futuna', code: 'WF'},
            {name: 'Western Sahara', code: 'EH'},
            {name: 'Yemen', code: 'YE'},
            {name: 'Zambia', code: 'ZM'},
            {name: 'Zimbabwe', code: 'ZW'}
        ];

    }]);
