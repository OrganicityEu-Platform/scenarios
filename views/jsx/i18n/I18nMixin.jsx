import React from 'react';

// Language codes:
// en-GB
// es-ES

// where current language is stored
const LOCAL_STORAGE_KEY = "organicity.lang";
// default language
const DEFAULT_LANG = "en-GB";

//
var I18nMixin = {
  getInitialState: function() {
    var currentLang;
    // list of all language codes
    var languageCodes = ['en-GB', 'es-ES'];
    // key-value map for all languages
    var data = {};
    data.enGB = require('../../../lang/en-GB.json');
    data.esES = require('../../../lang/es-ES.json');

    // Read current language from localStorage. Use default if missing.
    currentLang = DEFAULT_LANG;
    try {
      var ls = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (ls && ls !== undefined) {
        currentLang = ls;
      }
    } catch (exp) {
      // survive, use default  (eg. iOS private mode)
    }

    return { "currentLang": currentLang, "langdata": data, "languageCodes": languageCodes };
  },

  setCurrentLanguage: function(language) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, language);
    } catch (exp) {
    }
    this.setState({currentLang: language});
    location.reload();
  },

  isCurrentLanguage: function(language) {
    if (this.state.currentLang === language) {
      return true;
    } else {
      return false;
    }
  },

  // 'es-ES' -> 'Espaniol'
  languageDisplayName: function(languageCode) {
    return this.lookup(languageCode, 'Meta.language_name', '');
  },

  /**
   * Translates string (key) based on current language.
   * 
   * Key can contain zero or one dot.
   * Eg:
   * 'Profile.save'
   * or
   * 'created_by'
   */
  i18n: function(key, defaultValue) {
    return this.lookup(this.state.currentLang, key, defaultValue);
  },

  lookup: function(languageCode, key, defaultValue) {
    try {
      var lang;
      var val;
      // Find language file (or rather: json)
      switch (languageCode) {
        case 'es-ES':
          lang = this.state.langdata.esES;
          break;
        case 'en-GB':
        default:
          lang = this.state.langdata.enGB;
      }
      // Key format (0 or 1 dot)
      if (key) {
        if (key.match(/\w+\.\w+/)) {
          var key1 = key.split(".")[0];
          var key2 = key.split(".")[1];
          val = lang[key1][key2];
        } else {
          val = lang[key];
        }
      }
      //
      if (val) {
        return val;
      } else {
        return defaultValue;
      }
    } catch (exp) {
      console.log('Error:');
      console.log(exp);
      return defaultValue;
    }
  },

  // For formatting TimeAgo.
  // Assumes suffix = "ago"
  i18nFormatter: function(value, unit, suffix, date) {
    var unitPlural = '';
    if (value > 1) {
      unitPlural = '_plural';
    }
    var u = this.i18n('TimeAgo.' + unit + unitPlural, unit);
    return value + ' ' + u;
  },

};

export default I18nMixin;
