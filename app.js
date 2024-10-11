const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  PHONENUMBER_MCC,
  DisconnectReason
} = require("@whiskeysockets/baileys");
const path = require("path");
const pino = require("pino");
const infoLog = require("./library/getInfo");
const readline = require('readline');
const { Boom } = require('@hapi/boom');
const fileSystemExtra = require("fs-extra")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tanyaTerminal = (text) =>
new Promise((resolve) => {
  rl.question(text, resolve);
});

const checkFileDirektori = async (jalur) => {
  try {
    const cekFile = await fileSystemExtra.pathExists(path.join(__dirname, jalur));
    return cekFile;
  } catch (error) {
    infoLog("error", "Error", "Error Dalam Mencari File")
  }
}

let kodePairing = "";
const koneksiFahmyBotWhatsapp = async () => {
  let loginBot, versiWaWeb, noHp;
  
  try {
    loginBot = await useMultiFileAuthState(path.join(__dirname, './session'));
    versiWaWeb = await  fetchLatestBaileysVersion();
  } catch(error) {
    infoLog("error", "Error Authentikasi", error);
  }
  
  const startBot = makeWASocket({
    version: versiWaWeb.version,
    printQRInTerminal: false,
    browser: ['Chrome (Linux)', '', ''],
    auth: loginBot.state,
    generateHighQualityLinkPreview : true,
    logger: pino({ level: 'silent' })
  });
  
  if(kodePairing == "" && !await checkFileDirektori("./session/creds.json")) {
    const generateCodePairing = async () => {
      let noHp = await tanyaTerminal("Masukkan Nomor HP (+62xxxxxx): ");
      if(noHp != "") {
        noHp = noHp.replace(/[^0-9]/g, ""); // Jika Terdapat String Ganti Dia Ke String Kosong / Dihapus (Hanya Menerima Angka)
        // Cek Apakah Nomor Tersebut Benar Harus Menggunakan Code Seperti +62, +63, dll
        if(Object.keys(PHONENUMBER_MCC).some((v) => noHp.startsWith(v))) {
          rl.close();
          kodePairing = await startBot.requestPairingCode(noHp);
          kodePairing = kodePairing?.match(/.{1,4}/g)?.join("-") || kodePairing;
          infoLog("info", "Kode Pairing Kamu", kodePairing)
          setTimeout(koneksiFahmyBotWhatsapp, 500);
        } else {
          infoLog("error", "Error", "No Hp Tidak Valid");
          await generateCodePairing();
        }
        
      } else {
        infoLog("error", "Error", "No Hp Tidak Diisi");
        await generateCodePairing();
      }
    }
    
    await generateCodePairing();
    
  } else {
    rl.close();
  }
  
  // Ketika Ada Orang Yang Mengirim Pesan Pribadi Maupun Grub
  startBot.ev.on("messages.upsert", (pesanParams) => {
    const pesan = pesanParams.messages[0];
    
    // Jika Pengirim Pesan Ber Id status@broadcast Jangan Lakukan Apapun
    if (pesan.key.remoteJid === "status@broadcast") return;
    // Cek Apakah Pesan Dari Grub
    const cekGrub = pesan.key.remoteJid.endsWith("@g.us");
    // Jika Lolos Lakukan Query Dibawah Ini, Dan Kirimkan Data
    require(__dirname + "/handler/pesanMasuk")({
      startBot,
      pesan,
      cekGrub
    });
    
    
  })
  
  // Ketika Credential / Kunci Diubah
  startBot.ev.on("creds.update", loginBot.saveCreds);
  // Ketika Melakukan Koneksi Saat Scan QR Code
  
  startBot.ev.on("connection.update", async (koneksi) => {
    if (koneksi.connection === 'close') {
      let errorKoneksi = new Boom(koneksi.lastDisconnect?.error)?.output.statusCode;
      if (errorKoneksi === DisconnectReason.badSession) {
        infoLog('error', 'Error Koneksi', 'Masalah pada sesi, Silakan hapus sesi dan lakukan pemindaian kembali.');
        startBot.logout()
      } else if (errorKoneksi === DisconnectReason.connectionClosed || errorKoneksi === DisconnectReason.connectionLost) {
        infoLog('error', 'Error Koneksi', 'Koneksi ditutup atau terputus, melakukan koneksi ulang...');
        koneksiFahmyBotWhatsapp();
      } else if (errorKoneksi === DisconnectReason.connectionReplaced) {
        infoLog('error', 'Error Koneksi', 'Koneksi digantikan, buka sesi baru terlebih dahulu sebelum melanjutkan.');
        startBot.logout();
      } else if (errorKoneksi === DisconnectReason.loggedOut) {
        infoLog('error', 'Error Koneksi', 'Perangkat keluar, Silakan lakukan pemindaian lagi dan jalankan program.');
        startBot.logout();
      } else if (errorKoneksi === DisconnectReason.restartRequired || errorKoneksi === DisconnectReason.timedOut) {
        infoLog('error', 'Error Koneksi', 'Perlu me-restart, Merestart...');
        koneksiFahmyBotWhatsapp();
      } else if (errorKoneksi === DisconnectReason.Multidevicemismatch) {
        infoLog('error', 'Error Koneksi', 'Pencocokan perangkat ganda, silakan lakukan pemindaian kembali.');
        startBot.logout();
      } else {
        infoLog('error', 'Error Koneksi', `Alasan Putus yang Tidak Dikenal: ${errorKoneksi} \n ${koneksi.connection}`);
        startBot.logout();
      }
    }
    if(koneksi.connection === "connecting") {
      infoLog("info", "Informasi", "Menghubungkan...")
    } 
    if(koneksi.connection === "open") {
        infoLog("success", "Connected", "Sukses");
      try {
        // Kirim Pesan Ke Nomor Sendiri Bahwa Sudah Terhubung
        infoLog("success", "Connected", "Sukses");
      } catch (error) {
        infoLog("error", "Error", error)
      }
    }
    
  })
  
}

koneksiFahmyBotWhatsapp();