using PrefeituraCachoeiro.Dominio.Entidades;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class MedicoesProjetoResponse
    {
        public int IdMedicoesProjeto { get; set; }
        public int NumeroMedicao { get; set; }
        public int IdContrato { get; set; }
        public ContratosResponse Contratos { get; set; }
        public DateTime DataMedicao { get; set; }
        public string? Resumo { get; set; }
        public int IdStatusMedicao { get; set; }
        public StatusMedicaoResponse StatusMedicao { get; set; }
        public IEnumerable<ItemsMedicoesProjetoResponse> Items { get; set; }
        public List<ArquivosMedicoesProjetoResponse> ArquivosMedicoesProjeto { get; set; }
        public int? IdProjeto { get; set; }
        public string Observacao { get; set; }
        public string Secretaria { get; set; }
    }
}