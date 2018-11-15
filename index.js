const path = require('path');
const fs = require('fs');
var glob = require('glob');
const rm = require('rimraf');
// console font color
const chalk = require('chalk');
// loading
const ora = require('ora');
const svgson = require('svgson');
const format = require('prettier-eslint');

const globPath = path.resolve(__dirname, `./svgs/*.svg`);

const types = ['path', 'polygon', 'point', 'rect', 'circle'];

let options = {
  eslintConfig: {
    parserOptions: {
      ecmaVersion: 7
    },
    rules: {
      semi: ['error', 'never'],
      singleQuote: ['error', 'single']
    }
  },
  prettierOptions: {
    bracketSpacing: true
  },
  fallbackPrettierOptions: {
    singleQuote: true
  }
};

// 检测属性类型
function detectType(node, data) {
  if (types.includes(node.name)) {
    if (!data[node.name + 's']) {
      data[node.name + 's'] = [];
    }
    data[node.name + 's'].push(node.attrs);
  }
  return data;
}
// 获得节点内容
function getAttributes(nodes, data) {
  // console.log(nodes.childs)
  if (
    typeof nodes === 'object' &&
    nodes !== null &&
    !(nodes instanceof Array)
  ) {
    data = detectType(nodes, data);
    if (nodes.childs) {
      data = getAttributes(nodes.childs, data);
    }
  } else if (nodes instanceof Array) {
    for (let i = 0; i < nodes.length; i++) {
      data = detectType(nodes[i], data);
      if (nodes[i].childs) {
        data = getAttributes(nodes[i].childs, data);
      }
    }
  }

  return data;
}
const iconSpinner = ora(`creating the javascript of icons' files...`);
iconSpinner.start();
glob.sync(globPath).forEach(function(svg) {
  fs.readFile(svg, 'utf-8', function(err, data) {
    svgson(
      data,
      {
        svgo: true
      },
      function(json) {
        // console.log('%O', json)
        let data = {
          width: 50,
          height: 50
        };
        data = getAttributes(json, data);
        //console.log('%O', data);
        const fileName = svg.split('/').slice(-1)[0];
        const iconName = fileName.split('.')[0];
        //.log(iconName);
        const iconPath = path.resolve(__dirname, `./icons/${iconName}.js`);
        iconSpinner.stop();
        rm(iconPath, err => {
          if (err) throw err;
          const content = `import Icon from '../../../components/aepIcon.vue'\nIcon.register({\n  ${iconName}:${JSON.stringify(
            data,
            null,
            2
          )}\n  })`;
          options.text = content;
          const result = format(options);
          fs.writeFile(iconPath, result, {}, error => {
            if (error) throw error;

            console.log(chalk.cyan(`${iconName} file is created.\n`));
          });
        });
      }
    );
  });
});
