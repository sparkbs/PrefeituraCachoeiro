using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class RegistrarDocumentosContratoRequest
    {
        public int IdContrato { get; set; }
        public List<IFormFile>? Arquivos { get; set; }
    }
}