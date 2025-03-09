using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class CodigoProjetoExistenteError : Error
    {
        public CodigoProjetoExistenteError(string message)
        {
            Message = message ?? "O código do projeto informado já existe.";
        }
    }
}