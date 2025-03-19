import axios from "axios";
import { app, net, protocol } from "electron";
import fs from 'fs/promises';
import utils from "lib/utils/main";
import path from "path";
import { Md5 } from "ts-md5";
function convertPath(originalPath) {
    const match = originalPath.match(/^\/([a-zA-Z])\/(.*)$/);
    if (match) {
        // 为 Windows 系统转换路径格式
        return `${match[1]}:/${match[2]}`;
    } else {
        return originalPath; // 其他系统直接使用原始路径
    }
}

protocol.registerSchemesAsPrivileged([
    {
        scheme: "localimage",
        privileges: {
            secure: true, // 让 Electron 信任这个方式就像信任网站的 HTTPS 一样
            supportFetchAPI: true, // 允许我们像在网页上那样请求资源
            standard: true, // 让这种方式的网址看起来像普通的网址
            bypassCSP: true, // 允许我们绕过一些安全限制
            stream: true, // 允许我们以流的形式读取文件，这对于大文件很有用
        },
    },
]);

export function registerImageProtocol() {
    protocol.handle("localimage", async (request) => {
        const imageTempPath = false ? 'temp' : app.getPath('temp')
        const decodedUrl = decodeURIComponent(
            request.url.replace("localimage://", "https://")
        );
        console.log(decodedUrl)
        const md5 = Md5.hashStr(decodedUrl)
        const filePath = path.join(imageTempPath, md5);

        try {
            await fs.access(filePath); // 默认使用 F_OK
            console.log(`${filePath} exists`);
            return net.fetch(filePath)
        } catch (err) {
            console.error(`${filePath} does not exist:`);
            const response = await net.fetch(decodedUrl)
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // 抛出错误，用于后续处理
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.startsWith("image/")) {
                console.log(contentType);
                const filePath = path.join(imageTempPath, md5);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await fs.writeFile(filePath, buffer);
                console.log("Image saved to:", filePath);
                return net.fetch(filePath)
            }
            console.log('直接请求url', contentType);
            // 如果不是图片，直接返回原url对应的fi
            return net.fetch(decodedUrl)
        }
    })
}