using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class RegistrarAprovacaoMedicaoRequest: BaseRegistrarMedicaoRequest
    {
        public List<IFormFile>? Arquivos { get; set; }
    }
}