using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class ItemsMedicoesProjetoResponse
    {
        public int IdItemMedicoesProjeto { get; set; }
        public int IdItemContrato { get; set; }
        public ItemsContratoResponse ItemsContrato { get; set; }
        public decimal Unidade { get; set; }
    }
}