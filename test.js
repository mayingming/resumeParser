const resumeParser = require("./index");

// console.log(typeof resumeParser("./candidates/resume.pdf"));
resumeParser("./candidates/test.pdf").then((result) => {
  console.log(result);
});
