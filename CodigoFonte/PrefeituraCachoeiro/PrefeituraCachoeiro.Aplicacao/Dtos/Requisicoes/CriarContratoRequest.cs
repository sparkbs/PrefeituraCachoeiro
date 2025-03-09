using Microsoft.AspNetCore.Http;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarContratoRequest
    {
        public DateTime DataContrato { get; set; }
        public string NumeroContrato { get; set; }
        public int EmpresaId { get; set; }
        public int TipoContratacao { get; set; }
        public string Gerente { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataTermino { get; set; }
        public int PrefeituraId { get; set; }
        public List<IFormFile>? Arquivos { get; set; }
        public IFormFile ArquivoTemplate { get; set; }
    }
}