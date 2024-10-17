using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class NoRecordsError : Error
    {
        public NoRecordsError(string message)
        {
            Message = message ?? "Dados não localizados";
        }
    }
}