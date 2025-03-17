/* eslint-disable */
const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const FFmpegStatic = require("ffmpeg-static-electron-forge").default;

async function prunePackageJson(buildPath) {
  const packageDotJsonPath = path.join(buildPath, "package.json");
  const content = await fsPromises.readFile(packageDotJsonPath);
  const json = JSON.parse(content.toString());
  Object.keys(json).forEach((key) => {
    switch (key) {
      case 'name': {
        break;
      }
      case 'version': {
        break;
      }
      case 'main': {
        break;
      }
      case 'author': {
        break;
      }
      case 'description': {
        break;
      }
      default: {
        delete json[key];
        break;
      }
    }
  });
  await fsPromises.writeFile(packageDotJsonPath, JSON.stringify(json, null, "\t"));
}

module.exports = {
  packagerConfig: {
    name: "Wechat-Plus",
    appCopyright: "Copyright (C) 2025",
    icon: "./setup/exe.ico",
    // ElectronForge 默认会将项目根目录下的所有文件及目录打包到 resources
    // 因此需要在这里忽略不需要打入到安装包的文件和目录
    ignore: [
      ".vscode",
      ".idea",
      "node_modules/.vite",
      "node_modules/.ignored",
      "node_modules/.cache",
      "README.md",
      "yarn.lock",
      "package-lock.json",
      "vite.config.js",
      "forge.config.js",
      ".gitignore",
      ".eslintrc.js",
      ".eslintignore",
      ".prettierignore",
      ".prettierrc.js",
      "LICENSE",
      "^(\/src$)",
      "^(\/scripts$)",
      "^(\/out$)",
      "^(\/setup$)",
      "^(\/screenshot$)",
      "^(\/docs$)",
    ],
    win32metadata: {
      ProductName: "wechat-plus",
      CompanyName: "",
      FileDescription: "Wechat with Ai",
      // 如果安装包需要以管理员权限运行，请打开下面的注释
      // "requested-execution-level": "requireAdministrator",
    },
    asar: true,
  },
  hooks: {
    // 在文件拷贝完成后触发
    packageAfterCopy: async (config, buildPath, electronVersion, platform, arch) => {
      // 精简 package.json，删除无需暴露的属性
      await prunePackageJson(buildPath);


      // 删除与当前平台无关的 ffmpeg 文件
      const platformMap = {
        darwin: "darwin",
        linux: "linux",
        win32: "win32",
      };
      const archMap = {
        arm64: "arm64",
        x64: "x64",
        ia32: "ia32",
      };

      const currentPlatformDir = platformMap[platform];
      const currentArchDir = archMap[arch];

      //const ffmpegBasePath = path.join(buildPath, "resources", "ffmpeg");
      const ffmpegDirs = [
        "node_modules\\ffmpeg-static-electron-forge\\dist\\bin\\darwin\\arm64",
        "node_modules\\ffmpeg-static-electron-forge\\dist\\bin\\darwin\\x64",
        "node_modules\\ffmpeg-static-electron-forge\\dist\\bin\\linux\\ia32",
        "node_modules\\ffmpeg-static-electron-forge\\dist\\bin\\linux\\x64",
        "node_modules\\ffmpeg-static-electron-forge\\dist\\bin\\win32\\ia32",
        "node_modules\\ffmpeg-static-electron-forge\\dist\\bin\\win32\\x64",
      ];
      console.log('ffmpegDirs')
      for (const dir of ffmpegDirs) {
        if (dir.endsWith(`${currentPlatformDir}\\${currentArchDir}`)) {
          const dirPath = path.join(buildPath, dir);
          const sourcePath = path.join(__dirname, dir);
          if (fs.existsSync(sourcePath)) {
            await fsPromises.cp(sourcePath, dirPath, { recursive: true });
          }
          /* if (fs.existsSync(dirPath)) {
            console.log(dirPath);
            await fsPromises.rm(dirPath, { recursive: true, force: true });
          } */
        }
      }

      /* for (const dir of ffmpegDirs) {
        if (!dir.endsWith(`${currentPlatformDir}\\${currentArchDir}`)) {
          const dirPath = path.join(buildPath, dir);
          if (fs.existsSync(dirPath)) {
            console.log(dirPath);
            await fsPromises.rm(dirPath, { recursive: true, force: true });
          }
        }
      } */
    },
  },
  rebuildConfig: {},
  makers: [
    {
      // 仅支持 Windows 平台
      name: "@electron-forge/maker-squirrel",
      config: {
        // 用于数字签名的证书路径和密码
        // certificateFile: './cert.pfx',
        // certificatePassword: process.env.CERTIFICATE_PASSWORD
      },
    },
    {
      // 仅支持 macOS 平台
      name: "@electron-forge/maker-dmg",
      config: {
        format: "ULFO",
      },
    },
    {
      // 创建一个 ZIP 压缩包，支持所有平台
      name: "@electron-forge/maker-zip",
    },
  ],
  plugins: [
    new FFmpegStatic({
      remove: false, // Required
      path: path.join(__dirname, "out", "Wechat-Plus-win32-x64"), // Set path of main build
    }),
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ],
};