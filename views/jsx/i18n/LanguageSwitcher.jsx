import React                        from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import I18nMixin                    from './I18nMixin.jsx';
import ui                           from '../../../ui_routes.js';

// Flag SVGs from:
// http://flag-icon-css.lip.is/
var LanguageSwitcher = React.createClass({
	mixins: [I18nMixin],

	handleClick: function(eventKey) {
		// call i18nMixin
		this.setCurrentLanguage(eventKey);
	},

	render: function() {
		const EN = ui.asset('static/img/flags/en.svg');
		const ES = ui.asset('static/img/flags/es.svg');
		var flag = '';
		// English menuitem
		if (this.isCurrentLanguage('en-GB')) {
		  flag = EN;
	      var miEn = <MenuItem eventKey="en-GB" active><img src={EN} className="lang-flag" ></img>English</MenuItem>
		} else {
	      var miEn = <MenuItem eventKey="en-GB"><img src={EN} className="lang-flag" ></img>English</MenuItem>
		}
		// Spanish menuitem
		if (this.isCurrentLanguage('es-ES')) {
		  flag = ES;
	      var miEs = <MenuItem eventKey="es-ES" active><img src={ES} className="lang-flag" ></img>ES Espaniol</MenuItem>
		} else {
	      var miEs = <MenuItem eventKey="es-ES"><img src={ES} className="lang-flag" ></img>ES Espaniol</MenuItem>
		}

		return (
		  <div>
			<img src={flag} className="lang-flag" id="lang-flag-nav" ></img>
			<DropdownButton bsStyle="link"
							title={'ES ' +this.currentLanguageDisplayName()}
							id="lang-dropdown" onSelect={this.handleClick} >
		      {miEn}
		      {miEs}
		    </DropdownButton>
		  </div>
	    );
	}
});

export default LanguageSwitcher;
