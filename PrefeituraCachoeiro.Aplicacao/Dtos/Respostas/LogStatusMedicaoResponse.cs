namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class LogStatusMedicaoResponse
    {
        public int IdLogStatusMedicao { get; set; }
        public int IdUsuario { get; set; }
        public UsuariosResponse Usuario { get; set; }
        public DateTime DataLog { get; set; }
        public int IdStatusMedicao { get; set; }
        public StatusMedicaoResponse StatusMedicao { get; set; }
        public string? MotivoStatusMedicao { get; set; }
    }
}