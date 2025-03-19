import axios from "axios";
import { app, net, protocol } from "electron";
import fs from 'fs/promises';
import path from "path";
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
        scheme: "weaiimage",
        privileges: {
            secure: true, // 让 Electron 信任这个方式就像信任网站的 HTTPS 一样
            supportFetchAPI: true, // 允许我们像在网页上那样请求资源
            standard: true, // 让这种方式的网址看起来像普通的网址
            bypassCSP: true, // 允许我们绕过一些安全限制
            stream: true, // 允许我们以流的形式读取文件，这对于大文件很有用
        },
    },
]);
const axiosInstance = axios.create({
    // Always use Node.js adapter
    adapter: "http"
});

export function registerImageProtocol() {

    protocol.handle("weaiimage", (request) => {
        const decodedUrl = decodeURIComponent(
            request.url.replace("weaiimage://", "https://")
        );
        console.log(decodedUrl)
        return net.fetch(decodedUrl)

    })
}