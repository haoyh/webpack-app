import _ from "lodash";
import Notes from "./data.csv";
import Data from "./data.xml";
import printMe from "./print.js";
import "./style.css"; // 导入样式

function component() {
  const element = document.createElement("div");
  const btn = document.createElement("button");
  const br = document.createElement("br");

  element.innerHTML = _.join(["hello", "webpak"], " ");

  // 设置样式
  //   element.classList.add("hello");
  // 添加图像
  //   const myImg = new Image();
  //   myImg.src = Img;
  //   element.appendChild(myImg);

  element.appendChild(br);

  btn.innerHTML = "Click me and check the console!";
  btn.onclick = printMe;
  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());
// 显示文件内容
// alert(JSON.stringify(Data));
console.log(Data);
// alert(JSON.stringify(Notes));
console.log(Notes);
