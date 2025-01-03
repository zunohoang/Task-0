const { XMLParser, XMLBuilder } = require('fast-xml-parser');

// Chuỗi XML
const xml = `
<note priority="high" category="reminder">
  <to ok='dsfg'>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>
`;

// Phân tích XML thành JSON
const parser = new XMLParser({
  ignoreAttributes: false
});
const jsonObj = parser.parse(xml);
console.log('Kết quả JSON:', jsonObj);
