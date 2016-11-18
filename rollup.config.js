import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

const pkg = require("./package.json");
const banner = `/*
 * ${pkg.name}
 * ${pkg.description}
 * @author ${pkg.author}
 * @license ${pkg.license}
 * @version ${pkg.version}
 */
`;

export default {
  banner,
  entry: 'index.js',
  moduleName: "RollTo",
  globals: {
    rollto: 'RollTo'
  },
  format: "umd",
  dest: "roll-to.min.js",
  plugins: [
    buble(),
    uglify()
  ]
};