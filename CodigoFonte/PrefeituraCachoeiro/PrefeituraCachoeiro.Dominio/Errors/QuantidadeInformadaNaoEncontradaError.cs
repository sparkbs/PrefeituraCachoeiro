using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class QuantidadeInformadaNaoEncontradaError : Error
    {
        public QuantidadeInformadaNaoEncontradaError(string message)
        {
            Message = message ?? "A quantidade informada não foi encontrada";
        }
    }
}