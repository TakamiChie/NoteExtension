// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

const CN_EXTENSION_STATUSBAR = "noteex_statusbar";
const CN_CHARCOUNTER = CN_EXTENSION_STATUSBAR + "_ccount";
const CN_PARAGRAPHCOUNTER = CN_EXTENSION_STATUSBAR + "_para";
const CN_DETAIL_DIALOG = "noteex_detail_dialog";
const CN_MDVIEW = CN_DETAIL_DIALOG + "_markdown_view";

function infoUpdate(){
  let nb = document.getElementById("note-body");
  let cc = document.getElementById(CN_CHARCOUNTER);
  let pc = document.getElementById(CN_PARAGRAPHCOUNTER);
  let txt = nb.textContent;
  cc.textContent = txt.length + "文字";
  pc.textContent = nb.querySelectorAll("p").length + "段落";
}

function showDetailDialog(e) {
  let dialog = document.getElementById(CN_DETAIL_DIALOG);
  let mdview = document.getElementById(CN_MDVIEW);  
  let nb = document.getElementById("note-body");
  var lines = [];
  nb.childNodes.forEach((item) => {
    let text = item.innerHTML.split("<br>").join("\n");
    switch(item.nodeName){
      case "P": 
        if(item.childNodes && item.childNodes[0] && item.childNodes[0].nodeName == "IMG"){
          let src = item.childNodes[0].src;
          lines.push(`![画像](${src})`); 
        }else{
          lines.push(text); 
        }
        break;
      case "H3": 
        lines.push("### " + text); 
        break;
      case "BLOCKQUOTE": 
        lines.push("> " + text.split("\n").join("\n> ")); 
        break;
      case "PRE":
        lines.push("```\n" + text + "\n```"); 
        break;
      case "FIGURE":
        let href = item.querySelector("a").href;
        let title = item.querySelector("a strong").textContent;
        lines.push(`[${title}](${href})`);
        break;
    }
  });
  mdview.value = lines.join("\n\n");
  dialog.height;
  dialog.showModal();
}

function createStatusBar(){
  let sb = document.createElement("div");
  let charcounter = document.createElement("div");
  let paracounter = document.createElement("div");
  let dialog = document.createElement("dialog");
  sb.id = CN_EXTENSION_STATUSBAR;
  charcounter.id = CN_CHARCOUNTER;
  paracounter.id = CN_PARAGRAPHCOUNTER;
  sb.appendChild(charcounter);
  sb.appendChild(paracounter);
  sb.addEventListener("click", showDetailDialog);
  return sb;
}

function createDetailDialog(){
  let dialog = document.createElement("dialog");
  let mdview = document.createElement("textarea");
  let mdlabel = document.createElement("label");
  let close = document.createElement("button");
  dialog.id = CN_DETAIL_DIALOG;
  mdlabel.textContent = "マークダウン書式";
  mdview.readonly = true;
  mdview.id = CN_MDVIEW;
  mdview.addEventListener("focus", () => {
    mdview.select();
  });
  mdlabel.appendChild(mdview);
  close.textContent = "閉じる";
  close.addEventListener("click", () => { dialog.close(); })
  dialog.appendChild(mdlabel);
  dialog.appendChild(close);
  return dialog;
}

/**
 * ステータスバーの設置を試行する
 */
function tryset(){
  let nb = document.getElementById("note-body");
  if(nb){
    let sb = document.getElementById(CN_EXTENSION_STATUSBAR);
    if(sb){
      // ステータスバーがまだ残っているので様子見
      setInterval(tryset, 10000);
    }else{
      // 設置処理
      document.body.appendChild(createStatusBar());
      document.body.appendChild(createDetailDialog());
      // モニター設置
      document.getElementById("note-body").addEventListener("input", infoUpdate);
      infoUpdate();
      setInterval(tryset, 10000);
    }
  }else{
    setInterval(tryset, 5000);
  }
}

tryset();