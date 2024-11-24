using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PrefeituraCachoeiro.Aplicacao.Interfaces;
using PrefeituraCachoeiro.Environment;

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
            _bucketName =  EnvVariables.BucketImagesLogos;
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
    }
}