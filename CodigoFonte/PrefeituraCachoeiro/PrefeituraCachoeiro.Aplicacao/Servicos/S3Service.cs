using Amazon.Runtime.Internal.Endpoints.StandardLibrary;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PrefeituraCachoeiro.Aplicacao.Interfaces;

namespace PrefeituraCachoeiro.Aplicacao.Servicos
{
    public class S3Service: IS3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly IConfiguration _configuration;

        public S3Service(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _configuration = configuration;
            _bucketName =  configuration["bucketimageslogos"];
        }

        public async Task<string> UploadLogoAsync(IFormFile logo)
        {
            if (logo == null || logo.Length == 0)
                throw new ArgumentException("O arquivo logo não pode ser nulo ou vazio.");

            var fileName = Path.GetFileName(logo.FileName);
            var key = $"{Guid.NewGuid()}_{fileName}";

            using (var stream = logo.OpenReadStream())
            {
                var request = new PutObjectRequest
                {
                    BucketName = _bucketName,
                    Key = key,
                    InputStream = stream,
                    ContentType = logo.ContentType,
                    CannedACL = S3CannedACL.PublicRead
                };

                var response = await _s3Client.PutObjectAsync(request);
                if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                    throw new Exception($"Erro ao fazer upload para o S3.Erro: {response.ToString()}");
            }

            return $"https://{_bucketName}.s3.amazonaws.com/{key}";
        }

        public async Task ApagarLogo(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("A URL não pode ser nula ou vazia.");

            // Extrai o nome do arquivo (key) a partir da URL
            var key = url.Substring(url.LastIndexOf('/') + 1);

            var request = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            var response = await _s3Client.DeleteObjectAsync(request);
            if (response.HttpStatusCode != System.Net.HttpStatusCode.NoContent)
                throw new Exception($"Erro ao apagar o arquivo no S3.Erro: {response.ToString()}");
        }

        public string ExtractFileNameFromUrl(string fileUrl)
        {
            try
            {
                // Extrai o nome do arquivo (key) a partir da URL
                var key = fileUrl.Substring(fileUrl.LastIndexOf('/') + 1);

                return (key);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<MemoryStream> DownloadFileFromS3Async(string fileName)
        {
            try
            {
                // Cria a solicitação para obter o arquivo do S3
                var request = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = fileName
                };

                // Obtém o objeto do S3
                var response = await _s3Client.GetObjectAsync(request);

                // Cria um MemoryStream para armazenar o conteúdo do arquivo
                var memoryStream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(memoryStream);
                memoryStream.Position = 0;  // Reseta a posição do stream

                return memoryStream;
            }
            catch (Exception)
            {
                // Caso ocorra algum erro, retornamos null
                return null;
            }
        }
    }
}