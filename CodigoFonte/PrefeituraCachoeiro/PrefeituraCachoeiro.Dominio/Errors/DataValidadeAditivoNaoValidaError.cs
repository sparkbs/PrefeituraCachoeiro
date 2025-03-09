using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class DataValidadeAditivoNaoValidaError : Error
    {
        public DataValidadeAditivoNaoValidaError(string message)
        {
            Message = message ?? "A data de validade informada para o aditivo não é válida";
        }
    }
}