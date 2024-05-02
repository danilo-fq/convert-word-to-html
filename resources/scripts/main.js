var mammoth = require("mammoth");

const fileInput = document.getElementById("input-file");
const fileLabel = document.getElementById("input-file-label");
const sectionEl = document.getElementsByClassName('caixaTexto')[0];
const downloadBtn = document.getElementsByClassName("download-btn")[0];




const mammothOptions = {
  transformDocument: transformElement,
  styleMap: [
    "p[style-name='alignCenter'] => p.alignCenter",
    "p[style-name='alignCenter Emphasis'] => p.alignCenter > em",
    "p[style-name='alignCenter Strong'] => p.alignCenter > strong",
    "i => em",
    "b => strong",
    "u => u"
  ],
  includeDefaultStyleMap: false

};



function transformElement(element) {
  console.log('quem é element no inicio?', element);
  if (element && element.children) {
    const elChildren = element.children;
 
    elChildren.forEach(child => {
      console.log("quem é o child? ", child);
      
      if (child.alignment === "center") {
        child.styleName = "alignCenter";
        child.children.forEach(grandson => {
          if (grandson.styleName === "Emphasis" 
            && !grandson.isBold === true 
            && !child.styleName.includes("Emphasis")
          ) {
            child.styleName += " Emphasis";
      
          } else if(grandson.styleName === "Strong" 
            && !child.styleName.includes("Strong")) {
            child.styleName += " Strong";
          }
        })
      }

      child.children.forEach((grandson) => {
        if (grandson.type === "run") {
          grandson.children.forEach( grandson2 => {
            if (grandson2.type === "image") {
              child.styleName = "alignCenter";
            }
          })
        }
      })
      
    });
    element = {... element, children: elChildren};
  }
  console.log("chega no fim?");

  return element;
}





const readFile = (file) => {
 return new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const arrayBuffer = loadEvent.target.result;
    resolve(arrayBuffer);
    mammoth.convertToHtml({arrayBuffer: arrayBuffer}, mammothOptions)
      .then((result) => {
        // console.log("quem é result do mammoth", result);
        sectionEl.innerHTML = result.value;
      })
      .catch(error => console.error(error));
  }
  reader.readAsArrayBuffer(file);
 })
  
}

fileInput.addEventListener("change", () => {
  try {
    const fileName = fileInput.files[0].name.split('.')[0];
    const fileExtension = fileInput.files[0].name.split('.')[1];

    if (!["doc", "docx"].includes(fileExtension)) {
      throw new Error("Formato do arquivo inválido!");
    }
  
    fileLabel.innerHTML = `Arquivo ${fileName} anexado!`;
    downloadBtn.disabled = false;
    readFile(fileInput.files[0]);

  } catch (error) {
    alert(error.message);
    console.error(error.message);
  }
  
});
