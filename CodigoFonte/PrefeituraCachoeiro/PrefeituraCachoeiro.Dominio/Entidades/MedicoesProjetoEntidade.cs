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
        public List<ItemsMedicoesProjetoEntidade> Items { get; set; }
        public List<LogStatusMedicaoEntidade> LogStatusMedicao { get; set; }
        public List<ArquivosMedicoesProjetoEntidade> ArquivosMedicoesProjeto { get; set; }
        public int? IdProjeto { get; set; }
        public ProjetoEntidade Projeto { get; set; }
        public string Observacao { get; set; }
        public string Secretaria { get; set; }

        public MedicoesProjetoEntidade(): base()
        {
            this.Create();
        }
    }
}