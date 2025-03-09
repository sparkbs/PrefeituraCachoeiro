using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class OrigemInformadaNaoEncontradaError : Error
    {
        public OrigemInformadaNaoEncontradaError(string message)
        {
            Message = message ?? "A origem informada não foi encontrada";
        }
    }
}