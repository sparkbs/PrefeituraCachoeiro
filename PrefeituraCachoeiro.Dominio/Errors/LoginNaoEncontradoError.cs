using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class LoginNaoEncontradoError : Error
    {
        public LoginNaoEncontradoError(string message)
        {
            Message = message ?? "Login não encontrado";
        }
    }
}
