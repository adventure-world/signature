const { spawn } = require('child_process');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
const fs = require('fs');
const { format } = require('date-fns');
let AZURE_FILE_LIST = [];

const prefixPath = '/home/deploy/prod/mongodump/';

// const prefixPath = '/Users/liujingqiang/Documents/chainbow/DagenAdmin/backup_file/'

async function uploadFile(fileName, filePath) {
  const AZURE_STORAGE_CONNECTION_STRING = '';
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error('Azure Storage Connection string not found');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

  const containerName = process.env.containerName ?? 'localtestcontainername';
  const containerClient = blobServiceClient.getContainerClient(containerName);
  try {
    let blobName = fileName + `-${ process.env.ENV }-mongodump.gz`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const stream = fs.createReadStream(filePath);
    const uploadBlobResponse = await blockBlobClient.uploadStream(stream);
    console.log('Blob was uploaded successfully. requestId: ', uploadBlobResponse.requestId);
    AZURE_FILE_LIST = [];
    await listBlobHierarchical(containerClient, '');
    await deleteExpireBackupFile(containerClient);
  } catch (error) {
    // 创建
    const createContainerResponse = await containerClient.create();
    console.log('Container was created successfully. requestId: ', createContainerResponse.requestId);
    await uploadFile(fileName, filePath);
  }
}

async function downloadFile(containerName, blobName, downloadPath) {
  const AZURE_STORAGE_CONNECTION_STRING =''
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error('Azure Storage Connection string not found');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  let readable = downloadBlockBlobResponse.readableStreamBody;

  console.info('Downloaded blob content...');

  const writeStream = fs.createWriteStream(downloadPath);
  for await (const chunk of readable) {
    if (writeStream.write(chunk) === false) {
      readable.pause();
    }
  }
  console.log('backup file was download successfully. ');
}

async function listBlobHierarchical(containerClient, prefixStr) {
  const maxPageSize = 2;
  const listOptions = {
    includeMetadata: false,
    includeSnapshots: false,
    includeTags: false,
    includeVersions: false,
    prefix: prefixStr,
  };

  let delimiter = '/';
  for await (const response of containerClient.listBlobsByHierarchy(delimiter, listOptions).byPage({ maxPageSize })) {
    const segment = response.segment;

    if (segment.blobPrefixes) {
      for await (const prefix of segment.blobPrefixes) {
        await listBlobHierarchical(containerClient, prefix.name);
      }
    }

    for (const blob of response.segment.blobItems) {
      const fileNameTime = blob.name.split('-')[0];
      AZURE_FILE_LIST.push(Number(fileNameTime));
      console.log(`\tBlobItem: name - ${ blob.name }`);
    }
  }
}

async function deleteExpireBackupFile(containerClient) {
  const fileList = [];
  const files = fs.readdirSync(prefixPath);
  files.forEach(function (name, index) {
    const stat = fs.lstatSync(`${ prefixPath }${ name }`);
    fileList.push({
      name,
      time: new Date(stat.birthtime).getTime()
    });
  });

  fileList.sort((pre, next) => next.time - pre.time);
  let saveIndex = process.env.saveIndex;
  if (!saveIndex) saveIndex = 3;
  console.info('[saveIndex ===]', process.env.saveIndex, saveIndex);
  if (fileList.length < saveIndex) return;
  const deleteFiles = fileList.splice(Number(saveIndex), fileList.length - saveIndex);
  const deleteFileNameList = deleteFiles.map((item) => item.name);
  for (const name of deleteFileNameList) {
    fs.unlinkSync(`${ prefixPath }${ name }`);
  }

  AZURE_FILE_LIST.sort((pre, next) => next - pre);
  const azureDeleteFiles = AZURE_FILE_LIST.splice(Number(saveIndex), AZURE_FILE_LIST.length - saveIndex);

  for (const name of azureDeleteFiles) {
    try {
      await deleteBlobIfItExists(containerClient, `${ name }-${ process.env.ENV }-mongodump.gz`);
    } catch (error) {
      console.error(`deleted blob error`, error.message);
    }
  }
}

async function deleteBlobIfItExists(containerClient, blobName) {
  const options = { deleteSnapshots: 'include' };
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);
  const resultDelete = await blockBlobClient.deleteIfExists(options);
  console.log(`deleted blob ${ blobName }`, resultDelete.succeeded);
  return resultDelete.succeeded;
}

// 还原备份步骤
// 1.在物理主机执行：docker cp  backup_file/202207110200-product.mongodump.gz  dagen-db:/
// 2.mongodb镜像执行：mongorestore --drop --gzip --archive=back_product.gz -u dagen -p dagen_password -d dagen
const backupDB = () => {
  const backupFileName = format(new Date().getTime(), 'yyyyMMddHHmmss');
  const filePath = prefixPath + backupFileName + `-${ process.env.ENV }-mongodump.gz`;
  const child = spawn(
    `docker exec -i dagen-db /usr/bin/mongodump --uri="mongodb://dagen:dagen_password@localhost:27017/dagen" --gzip --archive  > ` +
    filePath,
    {
      stdio: 'pipe',
      shell: true,
    },
  );

  child.stdout.on('data', (data) => {
    console.log(data);
  });

  child.stderr.on('data', (data) => {
    console.log(Buffer.from(data).toString());
  });

  child.on('exit', async (code, signal) => {
    if (code) {
      console.log('process exit with code', code);
    } else if (signal) {
      console.log('process killed with signal', signal);
    } else {
      const startTime = format(new Date().getTime(), 'yyyy-MM-dd HH:mm');
      console.info(startTime + '>>  start backup mongodb file');
      console.info('backup file name', backupFileName + `-${ process.env.ENV }-mongodump.gz`);
      console.info('backup file path', filePath);

      // 开始上传文件
      await uploadFile(backupFileName, filePath);
      const endTime = format(new Date().getTime(), 'yyyy-MM-dd HH:mm');
      console.info(endTime + '>>  finish backup mongodb file');
    }
  });
};
backupDB();

// 12点 24点 各执行一次
// cron.schedule('0 */12 * * *', () => backupDB())
// cron.schedule('*/1 * * * *', () => backupDB())
console.info('backup schedule start');
