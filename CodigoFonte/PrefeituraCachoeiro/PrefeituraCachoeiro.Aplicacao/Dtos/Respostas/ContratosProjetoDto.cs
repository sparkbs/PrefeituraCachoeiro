namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    public class ContratosProjetoDto
    {
        public int IdContratoProjeto { get; set; }
        public int IdContrato { get; set; }
        public int IdProjeto { get; set; }
        public ContratoSimplesResponse Contratos { get; set; }
    }
}