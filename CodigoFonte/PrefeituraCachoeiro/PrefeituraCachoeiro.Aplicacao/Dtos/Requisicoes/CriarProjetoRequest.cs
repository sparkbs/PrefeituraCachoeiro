using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Requisicoes
{
    [ExcludeFromCodeCoverage]
    public class CriarProjetoRequest
    {
        public string Nome { get; set; }
        public int CodigoProjeto { get; set; }
        public int IdPrefeitura { get; set; }
    }
}