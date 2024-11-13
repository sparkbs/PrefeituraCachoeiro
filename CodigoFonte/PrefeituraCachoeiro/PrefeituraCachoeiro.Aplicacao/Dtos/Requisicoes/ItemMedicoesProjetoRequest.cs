using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class ItemMedicoesProjetoRequest
    {
        public int IdItemContrato { get; set; }
        public decimal Unidade { get; set; }
    }
}