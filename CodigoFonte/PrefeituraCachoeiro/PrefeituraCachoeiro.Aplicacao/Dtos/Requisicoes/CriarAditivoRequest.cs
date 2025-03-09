using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarAditivoRequest
    {
        public int ContratoId { get; set; }
        public IFormFile ArquivoTemplate { get; set; }
        public string TipoAditivo { get; set; }
        public DateTime DataAssinaturaAditivo { get; set; }
        public DateTime DataValidadeAditivo { get; set; }
    }
}