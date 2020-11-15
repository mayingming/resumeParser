const { SKILLSET, Location } = require("./config");
const PDFParser = require("pdf2json");

function formatting(str) {
  return str.replace(
    /(^\s*)|\^|\?|\!|\/|\\|\:|\$|\&|\||,|\[|\]|\{|\}|\(|\)|\=|(\s*$)/g,
    " "
  );
}
const isEmail = (email) => {
  const regEx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (email.match(regEx)) return true;
  else return false;
};
const isPhone = (phone) => {
  const regEx = /(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})/;
  let plist = phone.match(regEx);
  if (plist.length != 0) {
    return plist[0];
  }
};

const resumeParser = (pdffile) => {
  let person = {
    address: "",
    skills: [],
    phone: "",
    emailAddress: "",
  };
  return new Promise((resolve, reject) => {
    // Set up the pdf parser
    let pdfParser = new PDFParser(this, 1);
    // Load the pdf document
    pdfParser.loadPDF(pdffile);
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(new Error(errData.parserError))
    );
    pdfParser.on("pdfParser_dataReady", () => {
      let rawdata = pdfParser.getRawTextContent();
      person.phone = isPhone(rawdata);
      for (i = 0; i < Location.length; i++) {
        if (rawdata.match(Location[i])) {
          person.address = Location[i];
          break;
        }
      }
      var data = formatting(rawdata)
        .replace(/\r\n/g, " ")
        .toLowerCase()
        .split(" ");
      data = data.filter(function (n) {
        return n;
      });
      for (i = 0; i < data.length; i++) {
        if (
          SKILLSET.indexOf(data[i]) != -1 &&
          person.skills.indexOf(data[i]) == -1
        ) {
          person.skills.push(data[i]);
        }
        if (isEmail(data[i])) {
          person.emailAddress = data[i];
        }
      }
      resolve(person);
    });
  }).catch((error) => {
    console.log(error);
  });
};

module.exports = resumeParser;
