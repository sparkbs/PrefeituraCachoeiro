using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarPrefeituraRequest : BasePrefeituraRequest
    {
        public int IdPrefeitura { get; set; }
    }
}