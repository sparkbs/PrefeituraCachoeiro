namespace PrefeituraCachoeiro.Dominio.Entidades
{
    public class LogStatusMedicaoEntidade: EntidadeBase
    {
        public int IdLogStatusMedicao { get; set; }
        public int IdUsuario { get; set; }
        public UsuariosEntidade Usuario { get; set; }
        public DateTime DataLog { get; set; }
        public int IdMedicoesProjeto { get; set; }
        public MedicoesProjetoEntidade MedicoesProjeto { get; set; }
        public int IdStatusMedicao { get; set; }
        public StatusMedicaoEntidade StatusMedicao { get; set; }
        public string? MotivoStatusMedicao { get; set; }

        public LogStatusMedicaoEntidade(): base()
        {
            this.Create();
        }
    }
}