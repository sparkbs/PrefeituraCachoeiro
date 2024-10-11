namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class MedicoesProjetoEntidade: EntidadeBase
    {
        public int IdMedicoesProjeto { get; set; }
        public int NumeroMedicao { get; set; }
        public int IdContrato { get; set; }
        public ContratosEntidade Contratos { get; set; }
        public DateTime DataMedicao { get; set; }
        public string? Resumo { get; set; }
        public int IdStatusMedicao { get; set; }
        public StatusMedicaoEntidade StatusMedicao { get; set; }
        public IEnumerable<ItemsMedicoesProjetoEntidade> Items { get; set; }
    }
}