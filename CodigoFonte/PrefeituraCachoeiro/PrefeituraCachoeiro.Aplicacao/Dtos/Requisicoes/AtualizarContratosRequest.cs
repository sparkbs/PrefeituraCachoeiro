namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    public class AtualizarContratosRequest
    {
        public int IdContrato { get; set; }
        public int IdProjeto { get; set; }
        public DateTime DataContrato { get; set; }
        public string NumeroContrato { get; set; }
        public decimal ValorSaldoRestante { get; set; }
    }
}