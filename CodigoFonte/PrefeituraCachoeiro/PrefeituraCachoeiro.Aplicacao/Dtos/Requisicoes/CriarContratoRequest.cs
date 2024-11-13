using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarContratoRequest
    {
        public int IdProjeto { get; set; }
        public DateTime DataContrato { get; set; }
        public string NumeroContrato { get; set; }
        public int EmpresaId { get; set; }
        public decimal Valor { get; set; }
        public int TipoContratacao { get; set; }
        public string Gerente { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataTermino { get; set; }
        public int PrefeituraId { get; set; }
    }
}