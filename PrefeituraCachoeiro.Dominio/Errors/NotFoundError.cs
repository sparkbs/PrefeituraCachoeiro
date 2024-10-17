using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class NotFoundError : Error
    {
        public NotFoundError(string message)
        {
            Message = message ?? "Dados não localizado";
        }
    }
}
