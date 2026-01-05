import { app, BrowserWindow } from 'electron';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VITE_DIST_PATH = path.join(__dirname, '../dist');


process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {
  
  const prodIconPath = path.join(VITE_DIST_PATH, 'icon.png');
 
  const devIconPath = path.join(process.cwd(), 'public/icon.png');

 

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    icon: process.env.VITE_DEV_SERVER_URL ? devIconPath : prodIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
     
  } else {
    mainWindow.loadFile(path.join(VITE_DIST_PATH, 'index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});