const path = require("path");
const infoLog = require("./getInfo")
const openAiLibrary = require("openai");
require('dotenv').config();

const openAi = new openAiLibrary({
  apiKey: process.env.API_OPENAI_TOKEN
})
  
const kirimPesan = async (startBot, pesan, pengirimPesan, templateText) => {
  try {
    await startBot.sendMessage(pengirimPesan.grubId ? pengirimPesan.grubId : pengirimPesan.nomor, templateText, {quoted: pesan});
  } catch(error) {
    infoLog("error", "Error Mengirim Pesan", error)
  }
}

const sayHello = async (startBot, pesan, pengirimPesan) => {
  
  let templateText = {
    text: `*Hello @${pengirimPesan.nomor.split("@")[0]}*, Salam Kenal Saya *Fahmy❀4You『BOT』父*, Saya Dibuat oleh *Fahmy 4you* Pada Tanggal *3 November 2023*, Terima Kasih Telah Menyapa Saya ツ`,
    mentions: [pengirimPesan.nomor]
  }
  
  await kirimPesan(startBot, pesan, pengirimPesan, templateText);
}

const showMenu = async (startBot, pesan, pengirimPesan) => {
  
  const text = `*Halo, @${pengirimPesan.nomor.split("@")[0]}*
*Ada Yang Bisa Dibantu ?*

 –  *Sapa Dan Lihat Menu*

┌  ◦  .hello
└  ◦  .menu

 –  *Fitur Fitur Bot*

┌  ◦  .tanya pertanyaanMu
│  ◦  .stiker (caption image)
│  ◦  .quotes
│  ◦  .gambarRandom deskripsi
│  ◦  .meme
│  ◦  .downloadTiktokMP3 Url
│  ◦  .downloadTiktokMP4 Url
│  ◦  .downloadYTMP3 Url
│  ◦  .downloadYTMP4 Url
└  ◦  cooming soon

*Silahkan Pilih Menu Diatas ᥫ᭡*
*Dan Terimakasih*`;

  const templateText = {
    image: {
      url: path.join(__dirname, "../img/banner.jpg"),
    },
    caption: text,
    headerType: 4,
    mentions: [pengirimPesan.nomor]
  }
  
  await kirimPesan(startBot, pesan, pengirimPesan, templateText);
  
}

const tanyaOpenAi = async (startBot, pesan, pengirimPesan, pesanYangDikirim) => {
  let pertanyaan = pesanYangDikirim.replace('.tanya ', '');
  
  let templateText = {
    text: `Pertanyaan Anda Sedang Di Proses`,
  }
  
  await kirimPesan(startBot, pesan, pengirimPesan, templateText);
  
  const responseAi = await openAi.chat.completions.create({
    messages: [{ role: 'user', content: pertanyaan }],
    model: 'gpt-3.5-turbo',
  });
  
  let responsePertanyaan = responseAi.choices[0].message.content
  
  templateText = {
    text: `${responsePertanyaan}
    
    
*Maaf jika anda kurang puas 🙏*
    `
  }
  
  await kirimPesan(startBot, pesan, pengirimPesan, templateText);
  
}

module.exports = {
  sayHello,
  showMenu,
  tanyaOpenAi,
}