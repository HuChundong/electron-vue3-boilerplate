import { PresignedUrlResponse } from "@/typings/wx";
import axios, { AxiosResponse } from "axios";
export class MinIOService {
    static async generatePresignedUrl(
        bucket: string,
        objectKey: string
    ): Promise<string> {
        const { data } = await axios.get<PresignedUrlResponse>(
            `http://192.168.2.202:8000/presigned_url?bucket_name=${bucket}&object_name=${objectKey}`
        );

        if (!data.success || !data.data) throw new Error("获取签名失败");
        return data.data;
    }

    static async getPresignedFileUrl(
        bucket: string,
        objectKey: string
    ): Promise<string> {
        const { data } = await axios.get<PresignedUrlResponse>(
            `http://192.168.2.202:8000/presigned_file?bucket_name=${bucket}&object_name=${objectKey}`
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
