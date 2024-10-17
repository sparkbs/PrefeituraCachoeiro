namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class StatusMedicaoEntidade: EntidadeBase
    {
        public int IdStatusMedicao { get; set; }
        public string? Nome { get; set; }

        public List<MedicoesProjetoEntidade> MedicoesProjeto { get; set; }
        public List<LogStatusMedicaoEntidade> LogStatusMedicao { get; set; }
    }
}