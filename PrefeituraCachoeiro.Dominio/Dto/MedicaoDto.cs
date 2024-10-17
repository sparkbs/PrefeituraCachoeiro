namespace PrefeituraCachoeiro.Dominio.Dto
{
    public class MedicaoDto
    {
        public int IdMedicoesProjeto { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataDelecao { get; set; }
        public DateTime DataMedicao { get; set; }
        public int IdContrato { get; set; }
        public int IdStatusMedicao { get; set; }
        public int NumeroMedicao { get; set; }
        public ContratoDto Contratos { get; set; } = new ContratoDto();
        public List<ItemsMedicoesProjetoDto> Items = new List<ItemsMedicoesProjetoDto>();
        public StatusMedicaoDto StatusMedicao = new StatusMedicaoDto();
    }
}