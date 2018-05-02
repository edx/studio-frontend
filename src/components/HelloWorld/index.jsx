import React from 'react';

// Sass styles are imported in JS so that we can programatically apply styles to React elements by
// class name.  Webpack's css-loader can later rename the actual class name to a name that is scoped
// to just this component to avoid clashing with other component styles that use the same class name
// (this is called CSS Modules).
import styles from './HelloWorld.scss'; // Need the .scss because Webpack assumes .js by default

// Render our translated "Hello, world!" message in a styled div.
export default class HelloWorld extends React.Component {
  render() {
    return (
      <div className={styles['hello-world']}>
        Hello, world!
      </div>
    );
  }
}