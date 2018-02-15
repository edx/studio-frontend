/* eslint-disable global-require,no-underscore-dangle */
if ((typeof window !== 'undefined' && !window._babelPolyfill) ||
   (typeof global !== 'undefined' && !global._babelPolyfill)) {
  // Don't load babel-polyfill if already loaded: https://github.com/babel/babel/issues/4019
  require('babel-polyfill'); // general ES2015 polyfill (e.g. promise)
}
/* eslint-enable global-require no-underscore-dangle */

/* eslint-disable import/first */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';

import AccessibilityPolicyPage from './components/AccessibilityPolicyPage';
import store from './data/store';
/* eslint-enable import/first */

addLocaleData(enLocaleData);

// hard-coded NON-defaults for testing. TODO: make these dynamic and correct
const locale = 'en';
const messages = {};

const AccessibilityApp = () => (
  <IntlProvider locale={locale} messages={messages}>
    <Provider store={store}>
      <div className="SFE-wrapper">
        <AccessibilityPolicyPage
          communityAccessibilityLink="https://www.edx.org/accessibility"
          phoneNumber="+1 617-258-6577"
          email="accessibility@edx.org"
        />
      </div>
    </Provider>
  </IntlProvider>
);

ReactDOM.render(<AccessibilityApp />, document.getElementById('root'));
