namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class BoletimDetalheProjetoResponse
    {
        public DateTime? DataMedicao { get; set; }
        public int NumeroMedicao { get; set; }
        public string Projeto { get; set; }
        public string SubCabecalho { get; set; }
        public List<BoletimProjetoDetalheResponse> SubBoletins { get; set; }
        public int IdContrato { get; set; }
        public string Secretaria { get; set; }
        public int IdEmpresa { get; set; }
        public string Empresa { get; set; }
    }
}