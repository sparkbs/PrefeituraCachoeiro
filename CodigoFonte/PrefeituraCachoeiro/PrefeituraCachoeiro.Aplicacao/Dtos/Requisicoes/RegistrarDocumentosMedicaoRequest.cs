using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class RegistrarDocumentosMedicaoRequest
    {
        public int IdMedicoesProjeto { get; set; }
        public List<IFormFile>? Arquivos { get; set; }
    }
}