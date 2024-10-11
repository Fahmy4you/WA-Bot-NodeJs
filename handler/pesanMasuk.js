const fungsiPesan = require("../library/fungsiPesan");
const infoLog = require("../library/getInfo")

module.exports = async ({startBot, pesan, cekGrub}) => {
  
  if(pesan && startBot && pesan.key) {
    let pesanText = pesan.message.extendedTextMessage
            ? pesan.message.extendedTextMessage.text
            : pesan.message.conversation;
    pesanText = pesanText.toLowerCase();
    const pengirimPesan = {
      "nama": pesan.pushName,
      "nomor": cekGrub ? pesan.key.participant : pesan.key.remoteJid,
      "grubId": cekGrub ? pesan.key.remoteJid : "",
    }
    const pesanDiriSendiri = pesan.key.fromMe; // Jika Mengirim Pesan Ke Diri Sendiri Maka Akan Bernilai True
    
    // Jika Mengirim Pesan Ke Diri Sendiri Jangan Lakukan Apapun
    if(pesanDiriSendiri) return;
    if(pesanText === ".hello") {
      try {
        fungsiPesan.sayHello(startBot, pesan, pengirimPesan);
        
      } catch(error) {
        infoLog("error", "Error", error)
      }
    }
    
    if(pesanText === ".menu") {
      try {
        fungsiPesan.showMenu(startBot, pesan, pengirimPesan);
        
      } catch(error) {
        infoLog("error", "Error", error)
      }
    }
    
    let myRegex = new RegExp(/^\.tanya\s*(.+)$/i)
    if(myRegex.test(pesanText)) {
      try {
        fungsiPesan.tanyaOpenAi(startBot, pesan, pengirimPesan, pesanText)
        
      } catch(error) {
        infoLog("error", "Error", error)
      }
    }
    
  } else {
    infoLog("error", "Error", "Salah Satu Parameter Tidak Ada Isinya")
  }
  
  
  
  return;
}