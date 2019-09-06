const rules = require("./webpack.rules");

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: "style-loader" }, { loader: "css-loader" }]
  },
  {
    test: /\.(ogg|mp3|wav|mpe?g)$/i,
    use: "url-loader"
  },
  {
    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
    use: "url-loader?limit=100000"
  }
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules
  }
};
