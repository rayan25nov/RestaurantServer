// import QRCode from "qrcode";
// import fs from "fs-extra";

// const generateQR = async (tableNumber) => {
//   const qrCodeText = `http://127.0.0.1:3000/table/${tableNumber}`;

//   // Generate QR codel
//   const qrCodeBuffer = await QRCode.toBuffer(qrCodeText);

//   // Save QR code to the qr folder
//   const qrFolderPath = "./qr";
//   const qrFilePath = `${qrFolderPath}/table_${tableNumber}.png`;

//   await fs.ensureDir(qrFolderPath);
//   await fs.writeFile(qrFilePath, qrCodeBuffer);

//   return qrFilePath;
// };

// generateQR(1);

