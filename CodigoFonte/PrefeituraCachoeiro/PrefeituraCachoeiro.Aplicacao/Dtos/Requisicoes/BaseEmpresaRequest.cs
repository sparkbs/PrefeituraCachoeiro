using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{

    [ExcludeFromCodeCoverage]
    public abstract class BaseEmpresaRequest
    {
        public string Nome { get; set; }
        public IFormFile? Logo { get; set; }
    }
}