namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class BoletimDetalheMedicaoDetalhadoResponse
    {
        public DateTime? DataMedicao { get; set; }
        public int NumeroMedicao { get; set; }
        public int IdProjeto { get; set; }
        public string Projeto { get; set; }
        public string SubCabecalho { get; set; }
        public List<BoletimMedicaoDetalheDetalhadoResponse> SubBoletins { get; set; }
    }
}