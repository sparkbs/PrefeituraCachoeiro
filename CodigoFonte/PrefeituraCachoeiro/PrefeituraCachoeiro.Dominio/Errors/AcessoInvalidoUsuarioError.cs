using PrefeituraCachoeiro.TratadorControlador.ObjetosValor;

namespace PrefeituraCachoeiro.Dominio.Errors
{
    public class AcessoInvalidoUsuarioError : Error
    {
        public AcessoInvalidoUsuarioError(string message)
        {
            Message = message ?? "O usuário atual não tem acesso";
        }
    }
}