using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarContratoRequest
    {
        public int IdProjeto { get; set; }
        public DateTime DataContrato { get; set; }
    }
}