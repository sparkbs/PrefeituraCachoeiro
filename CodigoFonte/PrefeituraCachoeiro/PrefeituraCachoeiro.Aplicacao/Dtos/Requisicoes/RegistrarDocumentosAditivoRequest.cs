using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class RegistrarDocumentosAditivoRequest
    {
        public int IdAditivo { get; set; }
        public List<IFormFile>? Arquivos { get; set; }
    }
}