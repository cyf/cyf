import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import dayjs from 'dayjs'
import mime from 'mime'
import { MemoryStoredFile } from 'nestjs-form-data'

const client = new S3Client({
  region: process.env.ASSETS_REGION,
  endpoint: process.env.ASSETS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.ASSETS_ACCESS_KEY_ID,
    secretAccessKey: process.env.ASSETS_ACCESS_KEY_SECRET,
  },
})

export async function putObject(
  file: MemoryStoredFile,
  dir: string = 'cyf-blog-web/',
) {
  const now = dayjs()
  const milliseconds = dayjs().valueOf()
  const beijingTime = now.format('YYYY-MM-DD')
  const newFileName = `${milliseconds}_${file.originalName}`
  const path = `${dir}${beijingTime}/${newFileName}`
  const command = new PutObjectCommand({
    Key: path,
    Body: file.buffer,
    Bucket: process.env.ASSETS_BUCKET,
  })
  const data = await client.send(command)
  return {
    oldFileName: file.originalName,
    fileSize: file.size,
    type: mime.getExtension(file.mimetype),
    url: `${process.env.ASSETS_HOST}/${path}`,
    name: newFileName,
  }
}
