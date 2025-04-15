namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class BoletimDetalheMedicaoResponse
    {
        public DateTime? DataMedicao { get; set; }
        public int NumeroMedicao { get; set; }
        public string Projeto { get; set; }
        public int IdProjeto { get; set; }
        public string SubCabecalho { get; set; }
        public List<BoletimMedicaoDetalheResponse> SubBoletins { get; set; }
        public string Secretaria { get; set; }
        public int IdEmpresa { get; set; }
        public string Empresa { get; set; }
    }
}