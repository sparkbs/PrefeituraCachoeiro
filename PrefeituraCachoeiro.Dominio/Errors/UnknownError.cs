using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class UnknownError : Error
    {
        public UnknownError(string message)
        {
            Message = message;
        }
    }
}