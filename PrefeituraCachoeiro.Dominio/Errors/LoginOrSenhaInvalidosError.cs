using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class LoginOrSenhaInvalidosError : Error
    {
        public LoginOrSenhaInvalidosError(string message)
        {
            Message = message ?? "Login ou Senha inválidos";
        }
    }
}