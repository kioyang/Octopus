const marked = require('marked');

module.exports = (source) => {
    console.log(source, 'source---------')
    const html = marked(source);
    return `export default ${JSON.stringify(html)}`;
}