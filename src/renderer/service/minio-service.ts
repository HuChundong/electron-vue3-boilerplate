import { PresignedUrlResponse } from "@/typings/wx";
import axios, { AxiosResponse } from "axios";
// 这个也要搞一个单例模式？用baseurl来实例化？感觉没必要哦，静态就行了

const BASE_URL = "http://192.168.2.12:8000";
export class MinIOService {
    static async generatePresignedUrl(
        bucket: string,
        objectKey: string
    ): Promise<string> {
        const { data } = await axios.get<PresignedUrlResponse>(
            `${BASE_URL}/presigned_url?bucket_name=${bucket}&object_name=${objectKey}`
        );

        if (!data.success || !data.data) throw new Error("获取签名失败");
        return data.data;
    }

    static async getPresignedFileUrl(
        bucket: string,
        objectKey: string
    ): Promise<string> {
        const { data } = await axios.get<PresignedUrlResponse>(
            `${BASE_URL}/presigned_file?bucket_name=${bucket}&object_name=${objectKey}`
        );

        if (!data.success || !data.data) throw new Error("获取签名失败");
        return data.data;
    }

    static async uploadFile(
        presignedUrl: string,
        file: File
    ): Promise<AxiosResponse> {
        return await axios.put(presignedUrl, file, {
            headers: { "Content-Type": file.type }
        });
    }
}
