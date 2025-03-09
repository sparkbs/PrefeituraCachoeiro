using Microsoft.AspNetCore.Http;

namespace PrefeituraCachoeiro.Aplicacao.Interfaces
{
    public interface IS3Service
    {
        Task<string> UploadLogoAsync(IFormFile logo);
        Task ApagarLogo(string url);
        string ExtractFileNameFromUrl(string fileUrl);
        Task<MemoryStream> DownloadFileFromS3Async(string fileName);
    }
}