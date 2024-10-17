using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;
using System.Diagnostics.CodeAnalysis;

namespace PrefeituraCachoeiro.Aplicacao.Dtos.Respostas
{
    [ExcludeFromCodeCoverage]
    public class TotalProcessamentoDosItemsMedicoesProjetoResponse
    {
        public decimal ValorTotalApurado { get; set; }
        public decimal ValorTotalMedido { get; set; }
        public Error Erro { get; set; }

        public TotalProcessamentoDosItemsMedicoesProjetoResponse() :this(0,0)
        {

        }

        public TotalProcessamentoDosItemsMedicoesProjetoResponse(decimal valorTotalApurado, decimal valorTotalMedido)
        {
            ValorTotalApurado = valorTotalApurado;
            ValorTotalMedido = valorTotalMedido;
        }
    }
}