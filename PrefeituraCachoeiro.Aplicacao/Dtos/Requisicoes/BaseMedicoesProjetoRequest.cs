using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public abstract class BaseMedicoesProjetoRequest
    {
        public int NumeroMedicao { get; set; }
        public int IdContrato { get; set; }
        public DateTime DataMedicao { get; set; }
        public string? Resumo { get; set; }
        public List<ItemMedicoesProjetoRequest> Items { get; set; }
    }
}