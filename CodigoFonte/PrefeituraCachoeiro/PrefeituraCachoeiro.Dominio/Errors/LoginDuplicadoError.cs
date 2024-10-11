using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class LoginDuplicadoError : Error
    {
        public LoginDuplicadoError(string message)
        {
            Message = message ?? "Login duplicado";
        }
    }
}