using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class AtualizarProjetoRequest
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public int CodigoProjeto { get; set; }
        public int IdPrefeitura { get; set; }
    }
}